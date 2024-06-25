const cartDB    = require   ('../../model/cartModel')
const variantDB = require   ('../../model/variantModel')
const walletDB  = require   ('../../model/walletModel')
const addressDB = require   ('../../model/addressModel')
const couponDB  = require   ('../../model/couponModel')
const userDB    = require   ('../../model/userModel')



//CART LOADING

const loadCart=async (req,res,next) => {
    try {

        const userID=req.session.login_id;
        let username=await userDB.findOne({_id: userID}).select('-_id name') 
        const cartProducts=await cartDB.findOne({userId: userID}).populate({
            path: 'products.productVariantId',
            select: 'variantName price stock block imageName',
            populate: {
                path: 'productID',
                model: 'Product'
            }
        });

        res.render('cart',{cartProducts,username})

    } catch(error) {
        next(error)
    }
}


//ADD TO CART 
const addToCart=async (req,res,next) => {

    try {

        const {variantID}=req.body;
        const userID=req.session.login_id;
        const authCheck=await cartDB.findOne({userId: userID})
        if(authCheck) {

            const variantExist=await cartDB.findOne({userId: userID,'products.productVariantId': variantID})
            const varinatData=await variantDB.findById(variantID)

            if(varinatData.block==true) {
                return res.status(400).json({error: 'Sorry product is unavilabel !'})
            } else if(varinatData.stock===0) {
                return res.status(400).json({error: 'Sorry product is out of stock !'})
            }
            else if(variantExist) {
                return res.status(400).json({error: "Product already exist in Cart"})
            } else {
                const addVariant=await cartDB.findOneAndUpdate({userId: userID},
                    {
                        $push: {
                            products: {
                                productVariantId: variantID
                            }
                        }
                    },
                    {new: true})

                return res.status(200).json({success: "Product added to cart"})

            }
        } else {

            const addCart=await cartDB.create({
                userId: userID,
                products: [{productVariantId: variantID,quantity: 1}]
            })

            return res.status(200).json({success: 'Product added to cart'})

        }

    } catch(error) {
        next(error)
    }
}

//DELETE CART ITEMS

const removeCartItem=async (req,res,next) => {
    try {
        const {variantID}=req.body;
        const userID=req.session.login_id;
        const authCheck=await cartDB.findOne({userId: userID,'products.productVariantId': variantID})

        if(authCheck) {

            const deleteItem=await cartDB.findOneAndUpdate({userId: userID},
                {
                    $pull: {
                        products: {
                            productVariantId: variantID
                        }
                    }
                },
                {new: true})
            return res.status(200).json({success: 'Item removed from cart'})

        } else {
            return res.status(400).json({error: "req failed"})
        }


    } catch(error) {
        next(error)
    }
}

//INCREASE CART ITEMS  

const addCartItems=async (req,res,next) => {
    try {
        const userID=req.session.login_id;
        const {variantID,quantity}=req.body
        const numberRegex=/^[1-5]$/;

        if(!numberRegex.test(quantity)) {
            return res.status(400).json({error: "Failed !"})
        }

        const authCheck=await cartDB.findOne({userId: userID,'products.productVariantId': variantID})
        if(authCheck) {

            const update=await cartDB.findOneAndUpdate({
                userId: userID,
                'products.productVariantId': variantID
            },
                {$set: {'products.$.quantity': quantity}},
                {new: true});

            if(update&&update.products&&update.products.length>0) {

                const newQuantity=update.products.find(product => product.productVariantId.equals(variantID)).quantity;
                return res.status(200).json({newQuantity,success: 'successfull'})
            }


        } else {
            return res.status(400).json({error: "Invalid operation !"})
        }




    } catch(error) {
        next(error)
    }
}



//CHECKOUT PAGE

const loadCheckOut=async (req,res,next) => {
    try {

        const userID=req.session.login_id;
        const username=await userDB.findOne({_id: userID}).select('-_id name') 

        const authCheck=await cartDB.findOne({userId: userID}).select('userId');

        if(authCheck) {

            const cartIteam=await cartDB.findOne({userId: userID}).populate({
                path: 'products.productVariantId',
                populate: {
                    path: 'productID',
                    model: 'Product'
                }
            });

            //IF CART ITEMS IS EMPTY
            if (cartIteam.products.length === 0) {
                return res.status(400).redirect('/cart');
            }


            const walletBalance=await walletDB.findOne({userID: userID}).select('balance -_id');
            let offerDiscount=0;
            const stock=cartIteam.products.filter(doc => doc.productVariantId.stock>0&&doc.productVariantId.block!==true);
            const quantites=stock.map(item => item.productVariantId.price*item.quantity);

            //CHECKING FOR OFFER DISCOUNT
            stock.map(item => {

                if(item.productVariantId.offerDiscount) {
                    offerDiscount+=parseInt((item.productVariantId.price*item.productVariantId.offerDiscount)/100)
                }
            });

            const subTotal=quantites.reduce((sum,currentValue) => sum+currentValue,0)
            let total=subTotal>10000? subTotal:subTotal+60;
            total=offerDiscount!=='null'? total-offerDiscount:total;

            const userAddress=await addressDB.findOne({userId: userID}).sort({createdAt: -1})
            //COUPON DETAILS
            const coupons = await couponDB.find({block: false}).select('-_id -block -updatedAt -createdAt')


            res.render('checkout',{
                stock,subTotal,userAddress,
                total,walletBalance,offerDiscount,
                coupons,username
            })

        } else {
            return res.status(400).redirect('/cart')
        }



    } catch(error) {
        next(error)
    }
}

//CHECK COUPON 

const checkCoupon=async (req,res,next) => {
    try {
        const total=parseInt(req.query.total);
        const code=req.query.code;
        const userID=req.session.login_id;
        const couponCode=code.toString();

        if(isNaN(total)) {
            return res.status(400).json({error: 'Invalid total value'});
        }

        const authCheck=await couponDB.findOne({couponCode: couponCode})
        if(authCheck) {
            const alreadyUsed=await couponDB.findOne({
                couponCode: code,
                usedList: {$elemMatch: {$eq: userID}}
            })

            if(alreadyUsed) {
                return res.status(400).json({error: 'Coupon already Used'})
            } else {
                if(total<authCheck.minPurchaseAmount) {
                    return res.status(400).json({error: `Purchase atlest for :${authCheck.minPurchaseAmount} to avail this coupon`})
                }
                const discountAmount=parseInt((total*authCheck.discountPercentage)/100)

                const finalDiscount=discountAmount>authCheck.maxDiscountAmount?
                    authCheck.maxDiscountAmount:discountAmount;

                const finalTotal=total-finalDiscount;
                return res.status(200).json({finalDiscount,finalTotal,success: 'Coupon applied'})
            }


        } else {
            return res.status(404).json({error: 'Coupon not found !.Enter correct code'})
        }

    } catch(error) {
        next(error)
    }
}







module.exports={
    loadCart,
    addToCart,
    removeCartItem,
    addCartItems,
    loadCheckOut,
    checkCoupon

}