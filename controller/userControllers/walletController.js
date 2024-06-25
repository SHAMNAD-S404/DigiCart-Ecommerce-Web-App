
const Razorpay   =   require ('razorpay')
const crypto     =   require ('crypto')
const walletDB   =   require ('../../model/walletModel')
const nameFinder =   require ('../../controller/userControllers/userController')
require('dotenv').config()



//GET WALLET
const walletPage=async (req,res,next) => {
    
    try {
        const userID   = req.session.login_id;
        const username = await nameFinder.usernameFinder(userID)

        const wallet   = await walletDB.findOne({userID: userID})
                        .sort({createdAt: -1})
                        .limit(6);

        //REVERSE THE TRANSACTION FIELD                             
        if(wallet) {
            wallet.transactions.reverse();
        }

        res.render('wallet',{wallet,username});


    } catch(error) {
        next(error)
    }
}



//LOAD WALLET 
const loadWallet=async (req,res,next) => {
    try {
        const userID=req.session.login_id;
        const {orderAmount}=req.body
        const amountRegex=/^(?!0$)(?!0\.0+$)(?!0\.\d+$)\d+(\.\d{1,2})?$/

        //AMOUNT VALIDATION
        if(!orderAmount) {
            return res.status(400).json({error: 'fill the field'})
        } else if(!amountRegex.test(orderAmount)) {
            return res.status(400).json({error: 'Enter valid amount!'})
        } else if(orderAmount>50000) {
            return res.status(400).json({error: 'Enter amount below 50,000'})
        }

        //creating a new instance of razorpay
        const instance=new Razorpay({
            key_id: process.env.RAZOR_KEYID,
            key_secret: process.env.RAZOR_KEYSECRET
        });

        //CREATING ORDER
        const order=await instance.orders.create({
            amount: orderAmount*100,
            currency: 'INR',
            receipt: userID.toString(),
            payment_capture: 1

        });

        return res.status(200).json({order,userID,keyID: process.env.RAZOR_KEYID})


    } catch(error) {
        next(error)
    }
}

//VERIFY ONLINE PAYMENT FOR WALLET

const walletVerifyPayment=async (req,res,next) => {
    try {

        const {razorpay_order_id,razorpay_payment_id,razorpay_signature,order_id,orderAmount}=req.body;

        const rechargedAmount=parseInt(orderAmount/100)

        const shasum=crypto.createHmac('sha256',process.env.RAZOR_KEYSECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest=shasum.digest('hex');

        //CHECKING PAYMENT IS VERIFIED
        if(digest===razorpay_signature) {

            // UPDATING WALLET DB WITH RESPONSE DATA
            const order=await walletDB.findOneAndUpdate({userID: order_id},
                {
                    $push: {
                        transactions: {
                            amount: rechargedAmount,
                            transactionMethod: 'Razorpay'
                        }
                    },
                    $inc: {balance: rechargedAmount}
                },
                {upsert: true,new: true});



            return res.status(200).json({order,success: 'Wallet Loaded successfully'})

        } else {
            return res.status(400).json({error: 'Failed'})
        }

    } catch(error) {
        next(error)
    }
}


module.exports={
    loadWallet,
    walletVerifyPayment,
    walletPage

}