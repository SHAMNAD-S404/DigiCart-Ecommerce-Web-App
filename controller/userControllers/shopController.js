    const categoryDB = require('../../model/catogoryModel')
    const productDB  = require('../../model/productModel');
    const variantDB  = require ('../../model/variantModel');
    const offerDB    = require ('../../model/offerModel')






    const loadShop=async (req,res) => {
        try {

            const allCategory=await categoryDB.find()
            const allProducts=await productDB.find().populate('variants')
            res.render('home',{allCategory,allProducts})
        } catch(error) {
            console.log("Error in loadShop",error);
            return res.status(500).redirect('/error')
        }
    }

const loadShopAll=async (req,res) => {

    try {

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


        //console.log(allVariants);

        const totalProducts=await variantDB.find(searchQuery).countDocuments();

        const totalPages=Math.ceil(totalProducts/limit);

        const products=await productDB.find()
            .populate('variants')

        const allCategory=await categoryDB.find()

        res.render('shopAll',{
            allVariants,allCategory,products,
            currentPage: (skip/limit)+1,totalPages,limit
        })

    } catch(error) {
        console.log("Error in loadShopAll",error);
        return res.status(500).redirect('/error')
    }
}


const loadAboutUs=async (req,res) => {

    try {
        const success=req.flash('success')
        res.render('about',{success})
    } catch(error) {
        console.log("Error in loadAboutUs",error);
        return res.status(500).redirect('/error')
    }
}

const errorPage=async (req,res) => {
    try {
        res.render('404')
    } catch(error) {
        console.error('failed to load error page');
        return res.status(500).redirect('/error')

    }
}


const loadFaq=async (req,res) => {

    try {
        res.render('faq')
    } catch(error) {
        console.log("Error in loadFaq",error);
        return res.status(500).redirect('/error')
    }
}

const loadContact=async (req,res) => {
    try {
        res.render('contact')
    } catch(error) {
        console.log("Error in loadContact",error);
        return res.status(500).redirect('/error')
    }
}

const loadLogin=async (req,res) => {
    try {
        const alert=req.flash('messages')
        const success=req.flash('success')
        res.render('login',{alert,success})
    } catch(error) {
        console.log("Error in loadlogin",error);
        return res.status(500).redirect('/error')

    }
}

const loadSignUp=async (req,res) => {

    try {
        const alert=req.flash('alert')
        res.render('signup',{alert})
    } catch(error) {
        console.log("Error in loadContact",error);
        return res.status(500).redirect('/error')
    }
}

const loadOTP=async (req,res) => {
    try {
        res.render('otp')
    } catch(error) {
        console.log("Error in loadOTP",error);
        return res.status(500).redirect('/error')
    }
}

const loadForgotPass=async (req,res) => {
    try {
        res.render('forgotPassword')
    } catch(error) {
        console.log("Error in loadContact",error);
        return res.status(500).redirect('/error')
    }
}


//PRODUCT DETAILS
const productDetails=async (req,res) => {
    try {
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

        res.render('product-details',{products,variants,offers,categoryOffers})

    } catch(error) {
        console.log(error);
        return res.status(500).redirect('/error')
    }
}





    module.exports = {
        loadShop,
        loadShopAll,
        loadAboutUs,
        errorPage,
        loadFaq,
        loadContact,
        loadLogin,
        loadSignUp,
        loadOTP,
        loadForgotPass,
        productDetails


    }