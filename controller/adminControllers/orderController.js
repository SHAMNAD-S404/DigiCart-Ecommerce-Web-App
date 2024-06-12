const orderDB   = require('../../model/orderModel');
const variantDB = require ('../../model/variantModel')
const walletDB  = require ('../../model/walletModel')


    const loadOrder = async (req,res) => {
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
            console.error(error);
        }
    }
    

    const loadOrderDetails = async (req,res) => {
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
            console.error(error);
        }
    }


//CHANGE ORDER STATUS
    
    const orderStatusUpdate = async (req,res) => {
        try {
            const{status,variantID,orderID} = req.body;
            const authCheck = await orderDB.findOne({_id:orderID,'orderItems.product':variantID}).select('_id');
            if(authCheck){
                if(status==='Cancelled'){

                    const orderDetail=await orderDB.findOne({_id:orderID,'orderItems.product': variantID})
                    if(orderDetail) {

                        //FILTER OUT THE CORRESPONDENT VARIANT DOC
                        const variantDetails=orderDetail.orderItems.find(item => item.product.equals(variantID))
                        const quantity=parseInt(variantDetails.quantity)
                        const productPrice=parseInt(variantDetails.productPrice)                      
                        const total=quantity*productPrice;   //CANCELLED PRODUCT PRICE

                        //INCREASE STOCK QUANTITY OF THAT PRODUCT
                        await variantDB.findByIdAndUpdate(variantID,
                                    {$inc: {stock: quantity}},{new: true});

                        const deductSubtotal=await orderDB.findByIdAndUpdate(orderID,
                                    {$inc: {subTotal: -total}},{new: true});

                        //UPDATE THE CHANGES
                        const subTotal=deductSubtotal.subTotal;
                        const deliveryfee=(subTotal>10000)? 'free shipping':(subTotal>0&&subTotal<=10000)? 60:0;
                        const grandTotal=(subTotal>10000)? subTotal:(subTotal>0&&subTotal<=10000)? subTotal+60:0;

                        const update=await orderDB.findByIdAndUpdate(orderID,{
                                    $set: {deliveryCharge: deliveryfee,
                                            grandTotal: grandTotal}},
                                            {new: true});

                        const updateStatus = await orderDB.findOneAndUpdate({_id:orderID,'orderItems.product':variantID},
                                            {$set:{
                                                'orderItems.$.quantity' :0,
                                                'orderItems.$.orderStatus' :status,
                                                'orderItems.$.productPrice' :0,
                                              }},{new:true});

                        //REFUND FOR ONLINE & WALLET  PURCHASE 
                        if (orderDetail.paymentMethod !=='COD') {

                             await walletDB.findOneAndUpdate({userID:orderDetail.userId},
                                         {
                                            $push: {transactions: {                                                
                                                    amount: total,
                                                    transactionMethod: 'Refund'}
                                                   },
                                            $inc:  {balance: total}
                                         },
                                            {upsert: true,new: true})
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
                        let refundedAmount= parseInt(quantity*productPrice);
                        

                        //DECREASING THE CLAIMED COUPON AMOUNT
                        if(orderDetail.couponDetails){
                            const coupon=orderDetail.couponDetails;
                            couponClaimedAmount = coupon.claimedAmount != 'null' ? coupon.claimedAmount : 0;
                            refundedAmount = parseInt(refundedAmount - couponClaimedAmount)
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
                                 {$set:{'orderItems.$.orderStatus' :status}},                                   
                                 {new:true})

                        return res.status(200).json({success: 'Refunded Successfully'})  

                        }else{
                            return res.status(403).json({error: 'Invalid Operation'})
                        }        

                }else{
                    
                     await orderDB.findOneAndUpdate({_id:orderID,'orderItems.product':variantID},
                                 {$set:{'orderItems.$.orderStatus' :status,                                   
                                  }},{new:true}) 

                    return res.status(200).json({success: 'Order Status updated Successfully'})                                              
                }

            }else{
                return res.status(403).json({error:'Invalid Operation'})
            }
            
                                    
        } catch (error) {
            console.log(error);
        }
    }





module.exports = {
    loadOrder,
    loadOrderDetails,
    orderStatusUpdate

}