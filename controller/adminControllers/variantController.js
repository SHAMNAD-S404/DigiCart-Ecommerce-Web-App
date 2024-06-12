const productDB  = require('../../model/productModel')
const catagoryDB = require('../../model/catogoryModel')
const variantDB  = require('../../model/variantModel')
const path       = require('path')
const sharp      = require('sharp')
require('dotenv').config()


const loadVarients=async (req,res) => {

    let ProductID = req.session.productID
    if(req.query.pId){
        ProductID = req.query.pId
     
    }
    
    try {

        res.render('variant',{ProductID})

    } catch(error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const insertVariant=async (req,res) => {

    try {
        const {productID,variantName,price,color,stock,ram,phoneMemory,size}=req.body
        const regexPattern=new RegExp(`^${variantName}$`,'i')
        const alreadyExist=await variantDB.aggregate([{$match: {name: regexPattern}}])

        if(alreadyExist.length>1) {

            return res.status(401).json({success: false,message: 'already exists'})

        }else{

            const images=[];

    //Resize the image 

            for(let i=0;i<req.files.length;i++) {
            const resizedImage=await sharp(req.files[i].path)
                .resize({width: 900,height: 900})
                .png({quality: 90,background: {r: 255,g: 255,b: 255,alpha: 0}})
                .toBuffer()

    //Save the resized image

            const newPath='public/uploaded_Images/resized'+req.files[i].filename;
            await sharp(resizedImage).toFile(newPath);
            const fileName=path.basename(newPath);
            images.push(fileName)
            
        }

        const productDetails=await productDB.findOne({_id: productID}).select('name categoryName -_id')

        const newVariant=new variantDB({

            productID: productID,
            variantName: variantName,
            price: price,
            color: color,
            stock: stock,
            ram: ram,
            phoneMemory: phoneMemory,
            size: size,
            imageName: images,
            productName: productDetails.name,
            categoryName: productDetails.categoryName

        })

        const saveVariant=await newVariant.save()

        if(saveVariant) {
            const variantID=saveVariant._id
            const addToProduct=await productDB.updateMany({_id: productID},{$push: {variants: variantID}})
            delete req.session.productID;
            

           // res.redirect('/admin/product-details?id='+productID);
           return res.status(200).json({success:true,message:'variant added',productID})
        }
        else {
            req.flash('alert','varinat saved failed')

            res.redirect('/admin/addVariants')
        }

      }
    } catch(error) {

        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}


const multipleVariant=async (req,res) => {

    try {
        const {productID,variantName,price,color,stock,ram,phoneMemory,size}=req.body
        //const imageName=req.files.map(file=>file.filename)
        const regexPattern=new RegExp(`^${variantName}$`,'i')
        const alreadyExist=await variantDB.aggregate([{$match: {name: regexPattern}}])

    if(alreadyExist.length>0) {

            return res.status(401).json({success: false,message: 'already exists'})

    }else{

        const images=[];
        for(let i=0; i<req.files.length;i++){

            const resizedImage = await sharp(req.files[i].path)
                    .resize({width:900, height : 900})
                    .png({quality: 90,background: {r: 255,g: 255,b: 255,alpha: 0}})
                    .toBuffer()
            //save the file
            const newPath='public/uploaded_Images/resized'+req.files[i].filename;
           
            await sharp(resizedImage).toFile(newPath);
            const fileName=path.basename(newPath);
            //const fileName=req.files[i].filename;
            images.push(fileName)

        }


        const newVariant=new variantDB({

            productID: productID,
            variantName: variantName,
            price: price,
            color: color,
            stock: stock,
            ram: ram,
            phoneMemory: phoneMemory,
            size: size,
            imageName: images

        })

        const saveVariant=await newVariant.save()
        if(saveVariant) {
            const variantID=saveVariant._id
            const addVariantId=await productDB.updateOne({_id: productID},{$push: {variants: variantID}})

            req.session.productID =productID

            return res.status(200).json({success: true,message: 'variant added'})
            //res.redirect('/admin/addVariants');
        }
        else {
            
            res.redirect('/admin/addVariants')
        }

        }
    } catch(error) {

        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}


const blockVariant = async(req,res) => {
    try {
        const variantID=req.query.id
        const block=await variantDB.findByIdAndUpdate(variantID,{$set: {block:true}});
        if (block) {
          
            res.redirect('/admin/product-details?id='+block.productID)
        }else{
            
            res.redirect('/admin/product-details?id='+block.productID)
            
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }

}

const unblockVariant = async(req,res) => {
    try {
        const variantID = req.query.id
        const unblock = await variantDB.findByIdAndUpdate(variantID,{$set:{block:false}});
        if (unblock) {
             res.redirect('/admin/product-details?id='+unblock.productID)
        }else{
           
            res.redirect('/admin/product-details?id='+unblock.productID)
        }
       
        
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const editVariant = async(req,res) => {
    try {
        const variantID = req.query.id
        const variant = await variantDB.findById(variantID)
        res.render('editVariant',{variant})
        
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const deleteVariant = async (req,res) => {

    try {
        const variantID = req.query.id
        const deleteVar = await variantDB.findByIdAndDelete(variantID)
        if (deleteVar) {
            console.log('succefully deleted');
        }else{
            console.error('failed to delete');
            
        }
        
    } catch (error) {
        console.error(error);
        return res.status(500).redirect('/admin/error')
    }
}


const updateVariant = async(req,res) => {
    try {

            const variantID = req.query.id
            const{variantName,price,color,stock,ram,phoneMemory,size,oldImage} = req.body

        //    const regexPattern=new RegExp(`^${variantName}$`,'i')
        //    const alreadyExist=await variantDB.aggregate([{$match: {name: regexPattern}}])

        //    if(alreadyExist.length>1) {

        //    return res.status(401).json({success: false,message: 'name already exists'})

        //}       
            let images =[];

            if(req.files && req.files.length > 0 ){
              
               // image = req.files.map(element => element.filename)
               for( let i =0; i< req.files.length; i++){
                const resizedImage = await sharp(req.files[i].path)
                        .resize({width : 900, height :900})
                        .png({quality: 90,background: {r: 255,g: 255,b: 255,alpha: 0}})
                        .toBuffer()

                //Save the resized image
                const newPath='public/uploaded_Images/resized'+req.files[i].filename;
                await sharp(resizedImage).toFile(newPath)
                const fileName = path.basename(newPath)
                images.push(fileName)
               }
            }else{
                images = oldImage.split(',')
            }

            const update = await variantDB.findByIdAndUpdate(variantID, {
                $set:{
                    variantName:variantName,
                    price:price,
                    color:color,
                    stock:stock,
                    ram:ram,
                    phoneMemory:phoneMemory,
                    size:size,
                    imageName:images
                }});

                if (update) {
                        
                        res.redirect('/admin/product-details?id='+update.productID)
                }else{
                    console.log('update failed');
                }             
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}




module.exports = {
    loadVarients,
    insertVariant,
    multipleVariant,
    blockVariant,
    unblockVariant,
    editVariant,
    updateVariant,
    deleteVariant

}