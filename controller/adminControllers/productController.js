
const path       = require('path')
const sharp      = require('sharp')
const productDB  = require ('../../model/productModel')
const catagoryDB = require ('../../model/catogoryModel')
const variantDB  = require ('../../model/variantModel')
require('dotenv').config()

 

const loadAddProducts = async (req,res,next) => {

    try {
      const allCatagories=await catagoryDB.find()
        res.render('addProducts',{categories: allCatagories})
    } catch (error) {
        next(error)
    }
}

const showProducts = async (req,res,next) => {

        try {

            const page = parseInt(req.query.page)||1
            const limit = parseInt(6)  
            const skip  = (page-1)*limit

             const showProducts = await productDB.find().populate('category')
                                    .populate('variants')
                                    .sort({createdAt:-1})
                                    .skip(skip)
                                    .limit(limit);
             
             const totalProducts = await productDB.countDocuments()
             const totalPages    = Math.ceil(totalProducts/limit)
                                    
             res.render('allProducts',{showProducts,currentPage:page,totalPages}) 

        } catch (error) {
            next(error)
        }

}

const insertProducts = async (req,res,next) => {
    
    try {
        
            const{name,discription,category,brand} = req.body

            const regexPattern = new RegExp(`^${name}$`,'i')
            const alreadyExist = await productDB.aggregate([{$match:{name:regexPattern}}])
            const categoryName = await catagoryDB.findOne({_id:category}).select('name -_id')
            
                if(alreadyExist.length > 0 ){
                   
                    return res.status(401).json({success:false,message:'already exist'})

                }else{
            
            //Resize the image 
            const resizedImage = await sharp (req.file.path)
                    .resize({width: 600,height: 450})
                    .png({quality: 90,background: {r: 255,g: 255,b: 255,alpha: 0}})
                    .toBuffer()

            //Save the resized image
            const newPath='public/uploaded_Images/resized'+req.file.filename;
            
            await sharp(resizedImage).toFile(newPath);
            const fileName = path.basename(newPath);
         
            const newProduct = new productDB({
                name : name,
                discription : discription,
                imageName : fileName,
                brand : brand,
                category : category,
                categoryName: categoryName.name
                

            })

            const save = await newProduct.save()
                if(save){
                    req.session.productID =  save._id;
                    
                    return res.status(200).json({success:true,message:'product added successful'})
                    }
                res.status(500).json({message: 'Failed to save product'});
         }  
    } catch (error) {
        next(error)
    }
};

const blockProducts = async (req,res,next) => {

    try {
        
        const productID = req.query.id
        await productDB.updateOne({ _id:productID},
                                 {$set:{Blocked:true}});

    } catch (error) {
        next(error)
    }

}

const unblockProducts = async (req,res,next) => {

    try {
        const productID = req.query.id
        await productDB.updateOne({_id: productID},{$set: {Blocked:false}})
       
        
    } catch (error) {
        next(error)
    }
}

const editProducts = async (req,res,next) => {

    try {
        const productID = req.query.id
        const allCatagories = await catagoryDB.find()
        const productDetails=await productDB.findById(productID).populate('category')
        res.render('editProducts',{product:productDetails,categories: allCatagories})
    } catch (error) {
        next(error)
    }
}

const updateProduct = async (req,res,next) => {

    try {
        const {id,name,discription,category,brand,oldImage} = req.body
        let imageName;
        const existingProduct = await productDB.findOne({name: name});

        if(existingProduct&&(existingProduct._id.toString()!==id||existingProduct.name.toLowerCase()!==name.toLowerCase())) {
            
            return res.status(401).json({success: false,message: 'Product name already exists'});
        }else{        
        if(req.file){
            
            //Resize the image 
            const resizedImage=await sharp(req.file.path)
                .resize({width: 600,height: 450})
                .png({quality: 95,background: {r: 255,g: 255,b: 255,alpha: 0}})
                .toBuffer()

            //Save the resized image
            const newPath='public/uploaded_Images/resized'+req.file.filename;
            await sharp(resizedImage).toFile(newPath);
            const fileName=path.basename(newPath);

            imageName=fileName
            

        }else {
            
            imageName=oldImage
        }
        

        const updateProduct = await productDB.findByIdAndUpdate({_id:id},{
            $set:{
                name:name,
                discription:discription,
                category:category,
                brand:brand,
                imageName:imageName
                }}) 
                                                           
            //return res.redirect('/admin/allProducts');
              return res.status(200).json({success:true,message:'product updated !!'})                                               
         }      
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async (req,res,next) => {

    try {
        const productID = req.query.id;
        await Promise.all[

         productDB.deleteOne({_id:productID}),
         variantDB.deleteMany({productID:productID})
         
        ];
       

    } catch (error) {
        next(error)
    }
}

const loadProductDetails = async(req,res,next) =>{

    try {
        const success   = req.flash('success') 
        const productID = req.query.id;
        const product   = await productDB.findById(productID).populate('category')
        const variant   = await variantDB.find({productID:productID})

        res.render('productDetails',{product,variant,success})
    } catch (error) {
        next(error)
    }
}




module.exports = {
    loadAddProducts,
    insertProducts,
    showProducts,
    blockProducts,
    unblockProducts,
    editProducts,
    updateProduct,
    deleteProduct,
    loadProductDetails
   
}
