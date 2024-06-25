    const categoryDB = require ('../../model/catogoryModel')
    const productDB  = require ('../../model/productModel');
    const variantDB  = require ('../../model/variantModel');
    const offerDB    = require ('../../model/offerModel')
    const userDB     = require ('../../model/userModel');
    const nameFinder = require ('../../controller/userControllers/userController')







    const loadShop = async (req,res,next) => {
        try {

            const userID = req.session.login_id;
            const username = await nameFinder.usernameFinder(userID)
        
            const allCategory = await categoryDB.find().limit(6)
            const allProducts = await productDB.find().populate('variants').limit(6)
            const latestProducts  =await productDB.find().populate('variants').limit(6).sort({createdAt:-1})

            res.render('home',{allCategory,allProducts,latestProducts,username})
        } catch(error) {
            next(error)
        }
    }

const loadShopAll=async (req,res,next) => {

    try {

        const userID = req.session.login_id;
        const username=await nameFinder.usernameFinder(userID)

        let searchQuery={}
        let sortCondition={}
        const limit=parseInt(req.query.limit)||12;
        const skip=parseInt(req.query.skip)||0;
        const search=req.query.search||"";
        const sort=req.query.sort

        //TO ESCAPE SPECIAL CHARACTERS
        function escapeRegex(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        }

        if(search) {
            const sanitizedSearch=escapeRegex(search);
            searchQuery={
                $or: [
                    {productName  : {$regex: sanitizedSearch,$options: 'i'}},
                    {variantName  : {$regex: sanitizedSearch,$options: 'i'}},
                    {categoryName : {$regex: sanitizedSearch,$options: 'i'}},

                ]
            };
        }

        //FOR SORTING FUNCTION
        if(sort) {

            if(sort==='Top - Offer') {
                sortCondition={offerDiscount: -1}
            } else if(sort==='Latest - Arrivel') {
                sortCondition={createdAt: -1}
            } else if(sort==='Price - low to high') {
                sortCondition={price: 1}
            } else if(sort==='Price - high to low') {
                sortCondition={price: -1}
            } else if(sort==='Name - A to Z') {
                sortCondition={productName: 1}
            } else if(sort==='Name - Z to A') {
                sortCondition={productName: -1}
            } else {
                sortCondition={}
            }
        }


        const allVariants=await variantDB.find(searchQuery)
            .populate('productID')
            .limit(limit)
            .skip(skip)
            .sort(sortCondition)


        const totalProducts=await variantDB.find(searchQuery).countDocuments();

        const totalPages=Math.ceil(totalProducts/limit);

        const products=await productDB.find()
            .populate('variants')

        const allCategory=await categoryDB.find()

        res.render('shopAll',{
            allVariants,allCategory,products,username,
            currentPage: (skip/limit)+1,totalPages,limit
        })

    } catch(error) {
        next(error)
    }
}


const loadAboutUs=async (req,res,next) => {

    try {
        const userID=req.session.login_id;
        const username=await nameFinder.usernameFinder(userID)
       
        const success=req.flash('success')
        res.render('about',{success,username})
    } catch(error) {
        next(error)
    }
}




const loadFaq=async (req,res,next) => {

    try {

        const userID=req.session.login_id;
        const username=await nameFinder.usernameFinder(userID)
        res.render('faq',{username})

    } catch(error) {
        next(error)
    }
}

const loadContact=async (req,res,next) => {
    try {

        const userID=req.session.login_id;
        const username=await nameFinder.usernameFinder(userID)

        res.render('contact',{username})

    } catch(error) {
        next(error)
    }
}

const loadLogin=async (req,res,next) => {

    try {


        const userID=req.session.login_id;
        const username=await nameFinder.usernameFinder(userID)
        const alert=req.flash('messages')
        const success=req.flash('success')

        res.render('login',{alert,success,username})

    } catch(error) {
        next(error)

    }
}

const loadSignUp=async (req,res,next) => {

    try {

        const userID    =   req.session.login_id;
        const username  =   await nameFinder.usernameFinder(userID)
        const alert     =   req.flash('alert')
        
        res.render('signup',{alert,username})

    } catch(error) {
        next(error)
    }
}

const loadOTP=async (req,res,next) => {
    try {

        const userID=req.session.login_id;
        const username=await nameFinder.usernameFinder(userID)

        res.render('otp',{username})

    } catch(error) {
        next(error)
    }
}

const loadForgotPass=async (req,res,next) => {

    try {

        res.render('forgotPassword')

    } catch(error) {
        next(error)
    }
}


//PRODUCT DETAILS
const productDetails=async (req,res,next) => {
    
    try {

        const userID=req.session.login_id;
        const username=await nameFinder.usernameFinder(userID)

        const productID=req.query.id
        const variantID=req.query.vId
        const products=await productDB.findById(productID).populate('variants')
        const variants=await variantDB.findById(variantID).populate({

            path: 'productID',
            populate: {
                path: 'category',
                model: 'catogoryModel'
            }
        });

        //FETCHING  PRODUCT OFFERS 
        const offers=await offerDB.findOne({productID: {$elemMatch: {$eq: productID}}})
            .select('discountPercentage offerName -_id')

        //FETCHING CATEGORY OFFERS
        const categoryOffers=await offerDB.findOne({
            categoryID: {
                $elemMatch: {
                    $eq: products.category
                }
            }
        }).select('discountPercentage offerName -_id')

        res.render('product-details',{products,variants,offers,categoryOffers,username})

    } catch(error) {

        next(error)
        
    }
}




    module.exports = {
        loadShop,
        loadShopAll,
        loadAboutUs,
        loadFaq,
        loadContact,
        loadLogin,
        loadSignUp,
        loadOTP,
        loadForgotPass,
        productDetails,
        


    }