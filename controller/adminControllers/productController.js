const file       = require('fs')
const path       = require('path')
const sharp      = require('sharp')
const productDB  = require ('../../model/productModel')
const catagoryDB = require ('../../model/catogoryModel')
const variantDB  = require ('../../model/variantModel')
const shamnad    = require('../../model/catogoryModel')
require('dotenv').config()

 

const loadAddProducts = async (req,res) => {

    try {
      const allCatagories=await catagoryDB.find()
        res.render('addProducts',{categories: allCatagories})
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const showProducts = async (req,res) => {

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
            console.log(error);
            return res.status(500).redirect('/admin/error')
        }

}

const insertProducts = async (req,res) => {
    
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
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
        return res.status(500).redirect('/admin/error')
    }
};

const blockProducts = async (req,res) => {

    try {
        
        const productID = req.query.id
        const productBlock = await productDB.updateOne({ _id:productID},
                                 {$set:{Blocked:true}});
        if(productBlock){
            console.log('success');
            // res.redirect('/admin/allProducts')
        }else{
            console.log('product not found !!');
           // return res.redirect('/admin/allProducts')
        }

    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }

}

const unblockProducts = async (req,res) => {

    try {
        const productID = req.query.id
        const productUnblock=await productDB.updateOne({_id: productID},{$set: {Blocked:false}})
       // res.redirect('/admin/allProducts')
        
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const editProducts = async (req,res) => {

    try {
        const productID = req.query.id
        const allCatagories = await catagoryDB.find()
        const productDetails=await productDB.findById(productID).populate('category')
        res.render('editProducts',{product:productDetails,categories: allCatagories})
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const updateProduct = async (req,res) => {

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
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const deleteProduct = async (req,res) => {

    try {
        const productID = req.query.id
        const deletion = await productDB.deleteOne({_id:productID})
        const variantDelete=await variantDB.deleteMany({productID:productID})
    
        if(deletion && variantDelete){
             console.log('both product and variant deleted sucess');
            // res.redirect('/admin/allProducts')
        }else{
            console.log('failed');
           // res.redirect('/admin/allProducts')
        }
       

    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const loadProductDetails = async(req,res) =>{

    try {
        const success   = req.flash('success') 
        const productID = req.query.id;
        const product   = await productDB.findById(productID).populate('category')
        const variant   = await variantDB.find({productID:productID})

        res.render('productDetails',{product,variant,success})
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
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