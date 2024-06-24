
const orderDB   = require('../../model/orderModel');
const variantDB = require ('../../model/variantModel')
const walletDB  = require ('../../model/walletModel')


    const loadOrder = async (req,res,next) => {
        try {

            const page = parseInt(req.query.page) || 1
            const limit = 6
            const skip  =(page - 1)*limit
            const totalDocuments = await orderDB.countDocuments()

            const orderInfo = await orderDB.find().populate('userId').populate({
                path: 'orderItems.product',
                model: 'Variant',
                populate: {
                    path: 'productID',
                    model: 'Product'
                }
                }).sort({createdAt: -1})
                  .skip(skip)
                  .limit(limit);

            const totalPages = Math.ceil(totalDocuments/limit)
           
            res.render('order',{orderInfo,currentPage:page,totalPages})
            
        } catch (error) {
            next(error)
        }
    }
    

    const loadOrderDetails = async (req,res,next) => {
        try {
            const orderID = req.query.orderId
            const orderInfo = await orderDB.find({_id: orderID}).populate({
                path: 'orderItems.product',
                model: 'Variant',
                populate: {
                    path: 'productID',
                    model: 'Product'
                }
            });

            res.render('orderDetails',{orderInfo})
            
        } catch (error) {
            next(error)
        }
    }


//CHANGE ORDER STATUS
    
    const orderStatusUpdate = async (req,res,next) => {
        try {
            const{status,variantID,orderID} = req.body;
            const authCheck = await orderDB.findOne({_id:orderID,'orderItems.product':variantID}).select('_id');
            if(authCheck){

                //FOR CANCEL ORDER FUCTIONS
                if(status==='Cancelled'){

                    const orderDetail=await orderDB.findOne({_id:orderID,'orderItems.product': variantID})
                    if(orderDetail) {

                        //FILTER OUT THE CORRESPONDENT VARIANT DOC
                        const variantDetails=orderDetail.orderItems.find(item => item.product.equals(variantID))
                        const quantity=parseInt(variantDetails.quantity)
                        const productPrice=parseInt(variantDetails.productPrice)                      
                        let total=quantity*productPrice;   //CANCELLED PRODUCT PRICE

                        //INCREASE STOCK QUANTITY OF THAT PRODUCT
                        await variantDB.findByIdAndUpdate(variantID,
                                    {$inc: {stock: quantity}},{new: true});

                        const deductSubtotal=await orderDB.findByIdAndUpdate(orderID,
                                    {$inc: {subTotal: -total}},{new: true});

                        //UPDATE THE CHANGES
                        const subTotal=deductSubtotal.subTotal;
                        const deliveryfee=(subTotal>10000)? 'free shipping':(subTotal>0&&subTotal<=10000)? 60:0;
                        const grandTotal=(subTotal>10000)? subTotal:(subTotal>0&&subTotal<=10000)? subTotal+60:0;

                        //UPDATION FIELDS
                        await Promise.all[

                         orderDB.findByIdAndUpdate(orderID,{
                                    $set: {deliveryCharge: deliveryfee,
                                            grandTotal: grandTotal}},
                                            {new: true}),

                         orderDB.findOneAndUpdate({_id:orderID,'orderItems.product':variantID},
                                            {$set:{
                                                'orderItems.$.quantity' :0,
                                                'orderItems.$.orderStatus' :status,
                                                'orderItems.$.productPrice' :0,
                                              }},{new:true})

                                        ];               

                        //REFUND FOR ONLINE & WALLET  PURCHASE 
                        if (orderDetail.paymentMethod !=='COD') {

                            //CHECKING FOR COUPON APPLIED OR NOT 
                            const couponExist=await orderDB.findOne({_id: orderID,couponDetails: {$exists: true}})
                            const orderCoupon=await orderDB.findById(orderID)

                            //DECREASING THE CLAIMED AMOUT
                            if (couponExist) {
                                
                                //DIVIDE THE COUPON
                                const coupon = orderDetail.couponDetails;                              
                                const totalProducts=parseInt(orderCoupon.orderItems.length)
                                const divideCouponAmount=parseFloat(coupon.claimedAmount/totalProducts)
                                couponClaimedAmount=Math.ceil(divideCouponAmount!='null'? divideCouponAmount:0);
                                total=parseInt(total-couponClaimedAmount)
                            }
                            
                            //CHECKING FOR OFFER CLAIMED PRODUCT && DEDUCTION

                            if (orderCoupon.offerDiscount !== 0) {

                                const offerDiscountAmount = orderCoupon.offerDiscount
                                const totalProducts=parseInt(orderCoupon.orderItems.length)
                                const divideOfferAmount=parseFloat(offerDiscountAmount/totalProducts)
                                const offerClaimedAmount=Math.ceil(divideOfferAmount!='null'? divideOfferAmount:0);
                                total=parseInt(total-offerClaimedAmount)
                            }

                            

                             await walletDB.findOneAndUpdate({userID:orderDetail.userId},
                                         {
                                            $push: {transactions: {                                                
                                                    amount: total,
                                                    transactionMethod: 'Refund'}
                                                   },
                                            $inc:  {balance: total}
                                         },
                                            {upsert: true});
                        }                     

                        return res.status(200).json({success:'Order Cancelled Successfully'})    
                    }else{
                        return res.status(403).json({error: 'Invalid Operation'})
                    }  

                } else if(status==='Refunded'){

                    let couponClaimedAmount=0;

                    const orderDetail=await orderDB.findOne({_id: orderID,'orderItems.product': variantID})

                    if(orderDetail) {

                        //FILTER OUT THE CORRESPONDENT VARIANT DOC
                        const variantDetails=orderDetail.orderItems.find(item => item.product.equals(variantID))
                        const quantity=parseInt(variantDetails.quantity)
                        const productPrice=parseInt(variantDetails.productPrice)
                        //FINDING TOTAL AMOUNT OF PRODUCT WITH PRO QUANTITY x UNIT PRICE
                        let refundedAmount= parseInt(quantity*productPrice);
                        

                        const couponExist=await orderDB.findOne({_id:orderID,couponDetails:{$exists:true}})
                        const orderCoupon=await orderDB.findById(orderID)
                   
                        //DECREASING THE CLAIMED COUPON AMOUNT
                        if(couponExist){
                            
                            //TO DIVIDE THE COUPON AMOUNT
                            const coupon = orderDetail.couponDetails;                          
                            const totalProducts=parseInt(orderCoupon.orderItems.length)
                            const divideCouponAmount = parseFloat(coupon.claimedAmount/totalProducts)                           
                            couponClaimedAmount = Math.ceil(divideCouponAmount != 'null' ? divideCouponAmount : 0);
                            refundedAmount = parseInt(refundedAmount - couponClaimedAmount)

                        }

                        //CHECKING FOR OFFER CLAIMED PRODUCT && DEDUCTION

                        if(orderCoupon.offerDiscount!==0) {

                            const offerDiscountAmount=orderCoupon.offerDiscount
                            const totalProducts     = parseInt(orderCoupon.orderItems.length)
                            const divideOfferAmount = parseFloat(offerDiscountAmount/totalProducts)
                            const offerClaimedAmount = Math.ceil(divideOfferAmount!='null'? divideOfferAmount:0);              
                            refundedAmount = parseInt(total-offerClaimedAmount)
                        }


                        //REFUNDING THE AMOUNT TO USER WALLET
                         await walletDB.findOneAndUpdate({userID:orderDetail.userId},
                                         {
                                            $push: {transactions: {                                                
                                                    amount: refundedAmount,
                                                    transactionMethod: 'Refund'}
                                                   },
                                            $inc:  {balance: refundedAmount}
                                         },
                                            {upsert: true,new: true})
                                 


                        //RESTOCKING
                        await variantDB.findByIdAndUpdate(variantID,
                            {$inc: {stock: quantity}},{new: true});

                        //UPDATE STATUS
                        await orderDB.findOneAndUpdate({_id:orderID,'orderItems.product':variantID},
                                 {$set:{'orderItems.$.orderStatus' :status}} );                                 
                                 

                        return res.status(200).json({success: 'Refunded Successfully'})  

                        }else{
                            return res.status(403).json({error: 'Invalid Operation'})
                        }        

                } else if(status==='Delivered'){

                     await orderDB.findOneAndUpdate({_id:orderID,'orderItems.product':variantID},
                                 {$set:{'orderItems.$.orderStatus' :status,deliveryDate:Date.now()}} ); 

                    return res.status(200).json({success: 'Order Status updated Successfully'})  

                } else{
               
                    
                     await orderDB.findOneAndUpdate({_id:orderID,'orderItems.product':variantID},
                                 {$set:{'orderItems.$.orderStatus' :status,                                   
                                  }},{new:true}) 

                    return res.status(200).json({success: 'Order Status updated Successfully'})                                              
                }

            }else{
                return res.status(403).json({error:'Invalid Operation'})
            }
            
                                    
        } catch (error) {
            next(error)
        }
    }





module.exports = {
    loadOrder,
    loadOrderDetails,
    orderStatusUpdate

}