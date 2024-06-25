
const Razorpay  =   require ('razorpay')
const crypto    =   require ('crypto')
const cartDB    =   require ('../../model/cartModel')
const couponDB  =   require ('../../model/couponModel')
const addressDB =   require ('../../model/addressModel')
const orderDB   =   require ('../../model/orderModel')
const variantDB  =   require ('../../model/variantModel')
const walletDB   =   require ('../../model/walletModel')
const nameFinder =   require ('../../controller/userControllers/userController')
require('dotenv').config()



//ORDER PLACE

const placeOrder=async (req,res,next) => {

    try {
        const userID=req.session.login_id;
        const {addressId,paymentMode,couponCode}=req.body;

        const authCheck=await cartDB.findOne({userId: userID}).select('userId');
        if(authCheck) {

            const cartIteam=await cartDB.findOne({userId: userID}).populate({
                path: 'products.productVariantId'
            });

            let offerDiscount=0;
            //FILTER CART PRODUCTS 
            const stock=cartIteam.products.filter(doc => doc.productVariantId.stock>0&&
                doc.productVariantId.block!==true);

            //CALCULATING PRICE FOR EACH PRODUCT WITH QUANTITY              
            const quantites=stock.map(item => item.productVariantId.price*item.quantity)
            const subTotal=quantites.reduce((sum,currentValue) => sum+currentValue,0)

            //UPDATING OTHER FIELD
            const deliveryFee=parseInt(subTotal)<10000? 60:'free delivery';
            let total=subTotal>10000? subTotal:subTotal+60;

            //OFFER DISCOUNT
            stock.map(item => {
                if(item.productVariantId.offerDiscount) {
                    offerDiscount+=parseInt((item.productVariantId.price*
                        item.productVariantId.offerDiscount)/100);
                }
            })

            //APPLYING OFFER DISCOUNT IN TOTAL
            total=total-offerDiscount;


            let couponDetails={};

            //APPLY COUPON 
            if(couponCode!==null) {

                const authCheck=await couponDB.findOne({couponCode: couponCode})
                if(authCheck) {

                    if(total<authCheck.minPurchaseAmount) {
                        return res.status(400).json({
                            error: `Purchase atlest for :${authCheck.minPurchaseAmount} 
                                                            to avail this coupon`})
                    }

                } else {
                    return res.status(404).json({error: 'Coupon not found !.Enter correct code'})
                }

                //ALREADY USED OR NOT 
                const isUsed=await couponDB.findOne({
                    couponCode: couponCode,
                    usedList: {$elemMatch: {$eq: userID}}
                });

                if(!isUsed) {
                    //APPLY COUPON

                    const coupon=await couponDB.findOne({couponCode: couponCode})
                    const discountAmount=parseInt((total*coupon.discountPercentage)/100)
                    const finalDiscount=discountAmount>coupon.maxDiscountAmount?
                        coupon.maxDiscountAmount:discountAmount;

                    total=total-finalDiscount;

                    //ADDING COUPON DETAILS TO OBJECT
                    couponDetails.discountPercentage=parseInt(coupon.discountPercentage)
                    couponDetails.claimedAmount=parseInt(finalDiscount)
                    couponDetails.couponCode=coupon.couponCode
                    couponDetails.minPurchaseAmount=parseInt(coupon.minPurchaseAmount)
                    couponDetails.maxDiscountAmount=parseInt(coupon.maxDiscountAmount)

                } else {
                    return res.status(400).json({error: "Coupon Already Used !"})
                }

            }
            //SELECTING SHIP ADDRESS FROM ADDRESS DATABASE   
            const userAddress=await addressDB.findOne({userId: userID,'address._id': addressId});
            const shippAddress=userAddress.address.find(item => item._id.toString()===addressId);

            //PUSHING ORDER TO ORDER ARRAY FIELD
            const orderItems=[];
            for(let element of stock) {
                const newOrderItem={
                    product: element.productVariantId._id,
                    quantity: element.quantity,
                    productPrice: element.productVariantId.price,
                    orderStatus: paymentMode==='ONLINE PAYMENT'? 'Pending Payment':'Processing'
                };
                orderItems.push(newOrderItem);
            }

            //CREATE NEW ORDER OBJECT
            const newOrder=new orderDB({
                userId: userID,
                orderItems: orderItems,
                paymentMethod: paymentMode,
                subTotal: subTotal,
                deliveryCharge: deliveryFee,
                grandTotal: total,
                shippingAddress: shippAddress,
                offerDiscount: offerDiscount
            });

            //ADD COUPON DETAILS IF ITS NOT NULL
            if(Object.keys(couponDetails).length>0) {
                newOrder.couponDetails=couponDetails;
            }

            //SAVE ORDER
            const placeOrder=await newOrder.save();
            if(placeOrder) {

                //ADD USER ID TO USEDLIST IN COUPON DB
                await couponDB.findOneAndUpdate({couponCode: couponCode},
                    {$push: {usedList: userID}})

                //DECREASING STOCK QUANTITY AND DELETE CART ITEMS
                stock.forEach(async (element) => {

                    //DECREASE STOCK
                    await variantDB.findByIdAndUpdate(element.productVariantId._id,
                        {$inc: {stock: -parseInt(element.quantity)}},{new: true});

                    //DELETE CART
                    await cartDB.deleteOne({'products.productVariantId': element.productVariantId._id});

                });
                //FOR MULTIPLE PAYMENT OPTIONS RESPONSE
                if(paymentMode==='COD') {
                    const orderID=placeOrder._id;

                    return res.status(200).json({orderID,success: 'Order placed successfully '})

                    //WALLET PAYMENT   
                } else if(paymentMode==='WALLET') {

                    //UPDATING WALLET DB
                    await walletDB.findOneAndUpdate({userID: userID},
                        {
                            $push: {
                                transactions: {
                                    amount: placeOrder.grandTotal,
                                    transactionMethod: 'Purchase'
                                }
                            },
                            $inc: {balance: -parseInt(placeOrder.grandTotal)}
                        });

                    const orderID=placeOrder._id;

                    return res.status(200).json({orderID,success: 'Order placed successfully '})

                } else {
                    //ONLINE PAYMENT

                    const orderID=placeOrder._id;
                    const grandTotal=placeOrder.grandTotal;

                    //creating a new instance of razorpay
                    const instance=new Razorpay({
                        key_id: process.env.RAZOR_KEYID,
                        key_secret: process.env.RAZOR_KEYSECRET
                    })

                    //CREATING ORDER
                    const order=await instance.orders.create({
                        amount: grandTotal * 100,
                        currency: 'INR',
                        receipt: orderID.toString(),// ORDER DB order_id
                        payment_capture: 1

                    });
                    

                    // Update the order with the Razorpay order ID
                    placeOrder.razorpayOrder_id=order.id;
                    await placeOrder.save();

                    //SENDING THE RESPONCE BACK
                    return res.status(200).json({order,placeOrder,keyID: process.env.RAZOR_KEYID});
                }

            } else {
                return res.status(400).json({error: 'oops Please try again '})
            }

        } else {
            return res.status(400).redirect('/cart')
        }

    } catch(error) {
        next(error)
    }
}


//VERIFY ONLINE PAYMENT 

const verifyPayment=async (req,res,next) => {
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature,order_id}=req.body;

        const shasum=crypto.createHmac('sha256',process.env.RAZOR_KEYSECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest=shasum.digest('hex');

        //CHECKING PAYMENT IS VERIFIED
        if(digest===razorpay_signature) {
            // UPDATING FEILD
            await orderDB.findByIdAndUpdate(order_id,
                {
                    'orderItems.$[].orderStatus': 'Processing',
                    razorPayment_id: razorpay_payment_id
                },
                {upsert: true,new: true});


            return res.status(200).json({order_id,success: 'Payment successfull and Order placed'})

        } else {
            return res.status(400).json({error: 'Failed'})
        }

    } catch(error) {
        next(error)
    }
}


//LOAD TRACK ORDERS 
const loadTrackOrder=async (req,res,next) => {
    try {
        const userID    = req.session.login_id;
        const orderID   = req.query.orderID
        const username  = await nameFinder.usernameFinder(userID)

        const authCheck=await orderDB.findOne({userId: userID,_id: orderID}).select('userId');
        if(authCheck) {

            const orderInfo=await orderDB.find({_id: orderID}).populate({
                path: 'orderItems.product',
                model: 'Variant',
                populate: {
                    path: 'productID',
                    model: 'Product'
                }
            });


            res.render('trackOrders',{orderInfo,username})

        } else {
            return res.status(400).json({error: 'Invalid operation'})

        }



    } catch(error) {
        next(error)
    }
}

//LOAD ORDER PAGE
const orderPage=async (req,res,next)=>{
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5 ;
        const skip  = (page-1)*limit
        const userID=req.session.login_id;
        const username = await nameFinder.usernameFinder(userID)
      
        const orderInfo=await orderDB.find({userId: userID}).populate({
            path: 'orderItems.product',
            model: 'Variant',
            populate: {
                path: 'productID',
                model: 'Product'
                }
            })
            .select('orderItems deliveryDate paymentMethod createdAt orderDate')
            .sort({createdAt: -1})
            .skip(skip)
            .limit(limit);


        const totalOrders = await orderDB.countDocuments({userId:userID});
        const totalPages  = Math.ceil(totalOrders/limit)



        res.render('orders',{orderInfo,currentPage:page,totalPages,username})
        
    } catch (error) {
        next(error)
        
    }
}


//CANCEL ORDER  

const cancelOrder=async (req,res,next) => {
    try {
        const {orderId,stock,variantId}=req.body
        const userID=req.session.login_id;
        const authCheck=await orderDB.findOne({userId: userID,_id: orderId}).select('userId')

        if(authCheck) {


            const orderDetail=await orderDB.findOne({userId: userID,_id: orderId,'orderItems.product': variantId})
        
            if(orderDetail) {

                //FINDOUT THE ONE DOCUMENT
                const variantDetails=orderDetail.orderItems.find(item => item.product.equals(variantId))
                const quantity=parseInt(variantDetails.quantity)
                const productPrice=parseInt(variantDetails.productPrice)
                let total=quantity*productPrice;  //PRICE OF CANCELLED PRODUCT

                //INCREASING THE STOCK QUANTITY
                await variantDB.findByIdAndUpdate(variantId,{$inc: {stock: quantity}},{new: true});


                const deductSubtotal = await orderDB.findByIdAndUpdate(orderId,
                                        {$inc: {subTotal: -total}},{new: true});

                const subTotal = deductSubtotal.subTotal;

                const deliveryfee=(subTotal>10000)? 'free shipping':(subTotal>0&&subTotal<=10000)? 60:0;
                let grandTotal=(subTotal>10000)? subTotal:(subTotal>0&&subTotal<=10000)? subTotal+60:0;

                //COUPON APPLIED CHECKING AND ACTIONS
                const isUsed=await orderDB.findOne({_id: orderId,couponDetails: {$exists: true}}).select('couponDetails')

                if(isUsed) {

                        //FIND NEW DISCOUNT
                        if(grandTotal>isUsed.couponDetails.minPurchaseAmount) {

                            const newDiscount = parseInt((grandTotal*isUsed.couponDetails.discountPercentage)/100)

                            const maxDiscountOfCoupon = isUsed.couponDetails.maxDiscountAmount

                            const finalDiscount = newDiscount>maxDiscountOfCoupon?
                                                  maxDiscountOfCoupon:newDiscount;

                            grandTotal=parseInt(grandTotal-finalDiscount)

                            //UPDATE DB
                            await orderDB.findByIdAndUpdate(orderId,{
                                $set:  {'couponDetails.claimedAmount': finalDiscount}  });
                                  
                          

                        } else {

                            //IF GRAND TOTAL LESSER-THAN COUPON MIN AMOUNT
                            const paymentMode = await orderDB.findById(orderId).select('paymentMethod')
                            const status      = await orderDB.findById(orderId).select('orderItems.orderStatus -_id')

                            if(paymentMode =='COD') {
                                const claimedAmount=parseInt(isUsed.couponDetails.claimedAmount)
                                grandTotal=grandTotal+claimedAmount

                                //UPDATE THE FIED IN DB
                                await orderDB.findByIdAndUpdate(orderId,{
                                    $set:
                                    {
                                        'couponDetails.couponReversedAmount': claimedAmount,
                                        'couponDetails.claimedAmount': 0
                                    }
                                });

                            } else {       

                                //CANCEL THE ALL ONLINE ORDERS COZ ORDER LESSERTHAN COUPON MIN AMOUNT
                                await orderDB.findByIdAndUpdate(orderId,{
                                         $set:{'orderItems.$[].orderStatus': 'Cancelled'} })
                                        
                                //REFUND FOR ALL CANCELLED PRODUCT
                                if(paymentMode!=='COD'&&status!=='Pending Payment') {
                                    
                                    //GIVING REFUND FOR ONLINE & WALLET PURCHASE 
                                    if (grandTotal>0) {

                                        await walletDB.findOneAndUpdate({userID: userID},
                                            {
                                                $push: {
                                                    transactions: {
                                                        amount: grandTotal,
                                                        transactionMethod: 'Refund'
                                                    }
                                                },
                                                $inc: {balance: grandTotal}
                                            }, {upsert: true,new: true});
                                    }   
                                  
                                }
                            }
                        }
                }


                //UPDATING ORDER FIELDS
                await orderDB.findByIdAndUpdate(orderId,
                             { $set: { deliveryCharge: deliveryfee,
                                      grandTotal: grandTotal } });
                            

                //UPDATE ORDERITEMS FIELD IN ORDER DB
                await orderDB.findOneAndUpdate({_id: orderId,'orderItems.product': variantId},
                            {$set: { 'orderItems.$.quantity': 0,
                                     'orderItems.$.orderStatus': 'Cancelled',
                                     'orderItems.$.productPrice': 0 }                      
                            });
                        
                     
                //REFUND FOR ONLINE AND WALLET PURCHASE
                const productStatus = variantDetails.orderStatus;

                if(orderDetail.paymentMethod!=='COD' && productStatus !=='Pending Payment') {

                    let couponClaimedAmount=0;

                    //const orderDetail=await orderDB.findOne({_id: orderID,'orderItems.product': variantID})

                    const couponExist=await orderDB.findOne({_id: orderId,couponDetails: {$exists: true}})
                    const orderCoupon=await orderDB.findById(orderId)

                        //DECREASING THE CLAIMED COUPON AMOUNT
                        if(couponExist) {

                            //TO DIVIDE THE COUPON AMOUNT
                            const coupon=orderDetail.couponDetails;
                            const totalProducts=parseInt(orderCoupon.orderItems.length)
                            const divideCouponAmount=parseFloat(coupon.claimedAmount/totalProducts)
                            couponClaimedAmount=Math.ceil(divideCouponAmount!='null'? divideCouponAmount:0);
                            total=parseInt(total-couponClaimedAmount)

                        }

                        //CHECKING FOR OFFER CLAIMED PRODUCT && DEDUCTION

                        if(orderCoupon.offerDiscount!==0) {

                            const offerDiscountAmount=orderCoupon.offerDiscount
                            const totalProducts=parseInt(orderCoupon.orderItems.length)
                            const divideOfferAmount=parseFloat(offerDiscountAmount/totalProducts)
                            const offerClaimedAmount=Math.ceil(divideOfferAmount!='null'? divideOfferAmount:0);
                            total=parseInt(total-offerClaimedAmount)
                        }

                        //REFUND AMOUNT IS >0 THEN CR TO WALLET
                        if (total>0) {

                            await walletDB.findOneAndUpdate({userID: orderDetail.userId},
                                {
                                    $push: {
                                        transactions: {
                                            amount: total,
                                            transactionMethod: 'Refund'
                                        }
                                    },
                                    $inc: {balance: total}
                                },{upsert: true})
                                                         
                        }
                       
                }

                return res.status(200).json({success: 'Order Cancelled Successfully'})

            } else {
                return res.status(403).json({error: 'Invalid Operation'})
            }


        } else {
            return res.status(403).json({error: 'Invalid Operation'})
        }

    } catch(error) {
        next(error)

    }
}




//ORDER RETURN REQUEST 
const orderReturn=async (req,res,next) => {
    try {
        const userID=req.session.login_id;
        const {variantId,orderId,retrunReason}=req.body
        const authCheck=await orderDB.findOne({userId: userID,_id: orderId,'orderItems.product': variantId}).select('_id');
        if(authCheck) {

            //UPDATE RETURN STATUS
            await orderDB.findOneAndUpdate({_id: orderId,'orderItems.product': variantId},
                {
                    $set: {
                        'orderItems.$.orderStatus': 'Return requested',
                        'orderItems.$.returnReason': retrunReason,
                    }
                },{upsert:true,new: true});


            return res.status(200).json({success: 'Your return request placed successfully'})
        } else {
            return res.status(403).json({error: 'Invalid Operation'})
        }

    } catch(error) {
        next(error)
    }
}


//RETRY ONLINE ORDER PAYMENT 

  const retryOrder = async(req,res,next)=>{
    try {

        const{orderID}=req.body
        const authCheck = await orderDB.findOne({_id:orderID,orderItems:
                            {$elemMatch:{orderStatus:'Pending Payment'}}})
            .select('_id grandTotal shippingAddress.name shippingAddress.phone');


        if (authCheck) {

            //creating a new instance of razorpay
            const instance=new Razorpay({
                key_id: process.env.RAZOR_KEYID,
                key_secret: process.env.RAZOR_KEYSECRET
            })

            const payAmount = parseInt(authCheck.grandTotal*100)
            //CREATING ORDER
            const order=await instance.orders.create({
                amount: payAmount ,
                currency: 'INR',
                receipt: orderID.toString(),// ORDER DB order_id

            });

            //SENDING THE RESPONCE BACK
            return res.status(200).json({order,authCheck,keyID: process.env.RAZOR_KEYID});

        }else{
            return res.status(403).json({error: 'Invalid Operation'})

        }                    

        
    } catch (error) {
        next(error)
    }
  }



module.exports={
    placeOrder,
    verifyPayment,
    loadTrackOrder,
    cancelOrder,
    orderReturn,
    orderPage,
    retryOrder,

}
