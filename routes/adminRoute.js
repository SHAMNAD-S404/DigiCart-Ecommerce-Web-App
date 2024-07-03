const express            = require  ('express')
const adminRoute         = express  ();
const adminController    = require  ('../controller/adminControllers/adminController')
const categoryController = require  ('../controller/adminControllers/categoryController')
const productController  = require  ('../controller/adminControllers/productController')
const variantController  = require  ('../controller/adminControllers/variantController')
const orderController    = require  ('../controller/adminControllers/orderController')
const couponController   = require  ('../controller/adminControllers/couponController')
const offerController    = require  ('../controller/adminControllers/offerController')
const adminAuth          = require  ('../middleware/adminAuth')
const flash              = require  ('express-flash')
const upload             = require  ('../middleware/multer');
const handleMulterError  = require  ('../middleware/multerErrorMiddleware')
const handleError        = require  ('../middleware/adminError')
require('dotenv').config();


adminRoute.set ('view engine','ejs');
adminRoute.set ('views','./view/admin');


adminRoute.use (express.json({ limit:'50mb' }));
adminRoute.use (express.urlencoded( { limit:'50mb',extended:true } ))
adminRoute.use (express.static('public/adminAssets'));
adminRoute.use (flash())

//Admin action Related Routes

 adminRoute.get  ('/',adminAuth.isLogout,adminController.loadLogin)
           .get  ('/home',adminAuth.isLogin,adminController.loadHome)          
           .get  ('/logout',adminAuth.isLogin,adminController.logOut)
           .get  ('/sales-report-filter',adminAuth.isLogin,adminController.filterSalesReport)
           .get  ('/userlist',adminAuth.isLogin,adminController.showUsers)
           .get  ('/block-user',adminAuth.isLogin,adminController.blockUser)
           .get  ('/unblock-user',adminAuth.isLogin,adminController.unblockUser)
           .get  ('/searchUsers',adminAuth.isLogin,adminController.showUsers)
           .post ('/',adminAuth.isLogout,adminController.verifyLogin)


//Category management Related Routes

  adminRoute.get   ('/add_category',adminAuth.isLogin,categoryController.loadCategory)
            .get   ('/category_management',adminAuth.isLogin,categoryController.showCategory)
            .get   ('/delete-category',adminAuth.isLogin,categoryController.deleteCategory)
            .get   ('/block-category',adminAuth.isLogin,categoryController.blockCategory)
            .get   ('/unblock-category',adminAuth.isLogin,categoryController.unblockCategory)
            .get   ('/edit-category',adminAuth.isLogin,categoryController.editCategory)
            .patch ('/edit-category',adminAuth.isLogin,upload.single('images'),categoryController.updateCategory)
            .post  ('/add_category',adminAuth.isLogin,upload.single('images'),categoryController.insertCategory)
            


//Product management Related Routes
 
adminRoute.get   ('/allProducts',adminAuth.isLogin,productController.showProducts)   
          .get   ('/product-details',adminAuth.isLogin,productController.loadProductDetails) 
          .get   ('/addProduct',adminAuth.isLogin,productController.loadAddProducts)
          .get   ('/block-product',adminAuth.isLogin,productController.blockProducts)
          .get   ('/unblock-product',adminAuth.isLogin,productController.unblockProducts)
          .get   ('/delete-product',adminAuth.isLogin,productController.deleteProduct)
          .get   ('/edit-product',adminAuth.isLogin,productController.editProducts)
          .patch ('/edit-product',adminAuth.isLogin,upload.single('images'),productController.updateProduct)
          .post  ('/addProduct',adminAuth.isLogin,upload.single('images'),productController.insertProducts)

//Variant management Related Routes

adminRoute.get  ('/addVariants',adminAuth.isLogin,variantController.loadVarients) 
          .get  ('/block-variant',adminAuth.isLogin,variantController.blockVariant)
          .get  ('/unblock-variant',adminAuth.isLogin,variantController.unblockVariant)
          .get  ('/edit-variant',adminAuth.isLogin,variantController.editVariant)
          .get  ('/delete-variant',adminAuth.isLogin,variantController.deleteVariant)
          .get  ('/download-sales-report-pdf',adminAuth.isLogin,adminController.downloadPdf)
          .post ('/add-anothervariant',adminAuth.isLogin,upload.any(),variantController.multipleVariant)
          .post ('/addVariants',adminAuth.isLogin,upload.any(),variantController.insertVariant)
          .post ('/edit-variant',adminAuth.isLogin,upload.any(),variantController.updateVariant)

//Coupon management Related Routes

adminRoute.get    ('/all-coupon',adminAuth.isLogin,couponController.loadCouponPage)
          .get    ('/add-coupon',adminAuth.isLogin,couponController.loadAddCoupon)
          .get    ('/edit-coupon',adminAuth.isLogin,couponController.loadEditCoupon)
          .post   ('/add-coupon',adminAuth.isLogin,couponController.addCoupons)
          .patch  ('/block-coupon',adminAuth.isLogin,couponController.blockCoupon)
          .patch  ('/unblock-coupon',adminAuth.isLogin,couponController.unblockCoupon)
          .patch  ('/edit-coupon',adminAuth.isLogin,couponController.updateCoupons)
          .delete ('/remove-coupon',adminAuth.isLogin,couponController.removeCoupon)

//ORDER MANAGEMENT

adminRoute.get   ('/orders',adminAuth.isLogin,orderController.loadOrder)
          .get   ('/order-details',adminAuth.isLogin,orderController.loadOrderDetails)
          .patch ('/update-order',adminAuth.isLogin,orderController.orderStatusUpdate)

//OFFER MANAGEMENT

adminRoute.get   ('/offers',adminAuth.isLogin,offerController.loadOfferPage)
          .get   ('/add-offer',adminAuth.isLogin,offerController.loadAddOffer)
          .post  ('/add-offer',adminAuth.isLogin,offerController.insertOffer)
          .patch ('/block-offer',adminAuth.isLogin,offerController.blockOffer)
          .patch ('/unblock-offer',adminAuth.isLogin,offerController.unblockOffer)
          

//FOR MULTER ERROR HANDLING    
adminRoute.use  (handleError)
adminRoute.use  (handleMulterError)


module.exports = adminRoute