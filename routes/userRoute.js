//Requiring Nessesery Modules

const express   = require  ('express');
const session   = require  ('express-session')
const flash     =  require ('express-flash');
const multer    = require  ('multer');
const userRoute = express  ();
const auth      = require('../middleware/userAuth')
const errorHandler       =  require ('../middleware/errorHandler')
const userController     = require  ('../controller/userControllers/userController');
const shopController     = require  ('../controller/userControllers/shopController')
const cartController     = require  ('../controller/userControllers/cartController')
const orderController    = require  ('../controller/userControllers/orderController')
const wishlistController = require  ('../controller/userControllers/wishlistController')
const walletController   = require  ('../controller/userControllers/walletController')

require('dotenv').config()


//g auth
const passport = require('passport')
                 require('../util/passport')


userRoute.set ('view engine','ejs');
userRoute.set ('views','./view/user')


userRoute.use (express.json())
userRoute.use (express.urlencoded({extended : true}))
userRoute.use (flash());

userRoute.use(passport.initialize())
userRoute.use(passport.session());



userRoute.get ('/auth/google' ,passport.authenticate('google',{
            scope:['email','profile'] }));


//auth Callback
userRoute.get('/auth/google/callback',
    passport.authenticate('google',{
        successRedirect :'/success',
        failureRedirect : '/failure'
    })
);

//Google Auth route
 userRoute.get ('/success',userController.successGoogleLogin)
          .get ('/failure',userController.failureGoogleLogin)

//Shop route
 userRoute.get ('/',shopController.loadShop)
          .get ('/shopall',shopController.loadShopAll)
          .get ('/contact',shopController.loadContact)
          .get ('/product-details',shopController.productDetails)
          .get ('/about',shopController.loadAboutUs)

//CART MANAGEMENT
 userRoute.get   ('/cart',auth.isLogin,cartController.loadCart)
          .get   ('/check-coupon',auth.isLogin,cartController.checkCoupon)  
          .post  ('/add-cart',auth.isLogin,cartController.addToCart)
          .patch ('/delete-cart',auth.isLogin,cartController.removeCartItem)
          .patch ('/edit-cart',auth.isLogin,cartController.addCartItems)

//ORDER MANAGEMENT  
 userRoute.get   ('/checkout',auth.isLogin,cartController.loadCheckOut)
          .get   ('/track-order',auth.isLogin,orderController.loadTrackOrder)
          .get   ('/orders',auth.isLogin,orderController.orderPage)                      
          .patch ('/cancel-order',auth.isLogin,orderController.cancelOrder)
          .patch ('/return-order',auth.isLogin,orderController.orderReturn)
          .post  ('/place-order',auth.isLogin,orderController.placeOrder)
          .post  ('/payment-retry',auth.isLogin,orderController.retryOrder)
          .post  ('/order/verify-payment',auth.isLogin,orderController.verifyPayment)

//User login & Signup
userRoute.get  ('/login',auth.isLogout,shopController.loadLogin)
         .get  ('/signup',auth.isLogout,shopController.loadSignUp)
         .get  ('/logout',auth.isLogin,userController.logout)
         .get  ('/forgotpassword',auth.isLogout,shopController.loadForgotPass)
         .get  ('/otp',auth.isLogout,shopController.loadOTP)
         .get  ('/resendOtp',auth.isLogout,userController.resendOTP)
         .get  ('/reset-password',auth.isLogout,userController.loadResetPassPage)
         .patch('/reset-password',auth.isLogout,userController.updatePassword)
         .post ('/reset-password',auth.isLogout,userController.resetPassword)
         .post ('/signup',auth.isLogout,userController.insertUser)
         .post ('/otp',userController.verifyOtp)
         .post ('/login',auth.isLogout,userController.verifyLogin)
         .post ('/forgotpassword',auth.isLogout,userController.forgotPass)      

 

//User management
userRoute.get   ('/user-profile',auth.isLogin,userController.userProfile)
         .get   ('/generate-referral',auth.isLogin,userController.generateReferral) 
         .patch ('/update-user',auth.isLogin,userController.updateUserProfile)
         .patch ('/change-password',auth.isLogin,userController.changePassword)
         .post  ('/add-address',auth.isLogin,userController.addAddress)
         .post  ('/verify-referral',auth.isLogin,userController.applyReferral)
         .patch ('/delete-address',auth.isLogin,userController.deleteAddress)       
         .patch ('/edit-address',auth.isLogin,userController.updateAddress) 

//WISHLIST MANAGEMENT
userRoute.post  ('/add-wishlist',auth.isLogin,wishlistController.addWishlist)        
         .patch ('/edit-wishlist',auth.isLogin,wishlistController.removeWishlistItem)        

//WALLET MANAGEMENT
userRoute.post ('/load-wallet',auth.isLogin,walletController.loadWallet)        
         .post ('/wallet/verify-payment',auth.isLogin,walletController.walletVerifyPayment)        
         .get  ('/wallet',auth.isLogin,walletController.walletPage)        
 





//TO HANDLE GLOBAL ERRORS IN USER ROUTE 
userRoute.use(errorHandler)





module.exports = userRoute ;