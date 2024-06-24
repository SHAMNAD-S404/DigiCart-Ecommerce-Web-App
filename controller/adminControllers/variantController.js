
const productDB  = require  ('../../model/productModel')
const variantDB  = require  ('../../model/variantModel')
require('dotenv').config()


const loadVarients=async (req,res,next) => {

    let ProductID = req.session.productID
    if(req.query.pId){

        ProductID = req.query.pId;    
    }
    
    try {

        //TO FETCH CATEGORY NAME
        const productDetails = await productDB.findOne({_id: ProductID}).populate({
                                    path:'category',
                                    select:'name -_id'
                                    })
                                    .select('_id');

        const categoryName = productDetails.category.name;

        res.render('variant',{ProductID,categoryName})

    } catch(error) {
        next(error)
    }
}

const insertVariant = async (req,res,next) => {

    try {
        const {productID,variantName,price,color,stock,ram,phoneMemory,size}=req.body
        const regexPattern=new RegExp(`^${variantName}$`,'i')
        const alreadyExist=await variantDB.aggregate([{$match: {name: regexPattern}}])

        if(alreadyExist.length>1) {

            return res.status(401).json({success: false,message: 'already exists'})

        }else{

            const images = [];

            for(let i=0;i<req.files.length;i++) {

                images.push(req.files[i].filename)               
            
            }


        const productDetails=await productDB.findOne({_id: productID}).select('name categoryName -_id brand')

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
            categoryName: productDetails.categoryName,
            brandName: productDetails.brand

        })

        const saveVariant=await newVariant.save()

        if(saveVariant) {
            const variantID = saveVariant._id;
            await productDB.updateMany({_id: productID},{$push: {variants: variantID}})
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

        next(error)
    }
}

//FOR ADDING MULTIPLE VARIANTS

const multipleVariant=async (req,res,next) => {

    try {

        const {productID,variantName,price,color,stock,ram,phoneMemory,size}=req.body
        const regexPattern=new RegExp(`^${variantName}$`,'i')
        const alreadyExist=await variantDB.aggregate([{$match: {name: regexPattern}}])

    if(alreadyExist.length>0) {

            return res.status(401).json({success: false,message: 'already exists'})

    }else{

        const images=[];

        for(let i=0;i<req.files.length;i++) {

            images.push(req.files[i].filename)

        }

        const productDetails=await productDB.findOne({_id: productID}).select('name categoryName -_id brand')

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
            categoryName: productDetails.categoryName,
            brandName: productDetails.brand

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

        next(error)
    }
}


const blockVariant = async(req,res,next) => {
    try {
        const variantID=req.query.id
        const block=await variantDB.findByIdAndUpdate(variantID,{$set: {block:true}});
        if (block) {
          
            res.redirect('/admin/product-details?id='+block.productID)
        }else{
            
            res.redirect('/admin/product-details?id='+block.productID)
            
        }
        
    } catch (error) {
        next(error)
    }

}

const unblockVariant = async(req,res,next) => {
    try {
        const variantID = req.query.id
        const unblock = await variantDB.findByIdAndUpdate(variantID,{$set:{block:false}});
        if (unblock) {
             res.redirect('/admin/product-details?id='+unblock.productID)
        }else{
           
            res.redirect('/admin/product-details?id='+unblock.productID)
        }
       
        
    } catch (error) {
        next(error)
    }
}

const editVariant = async(req,res,next) => {
    try {
        const variantID = req.query.id
        const variant = await variantDB.findById(variantID)
        res.render('editVariant',{variant})
        
    } catch (error) {
        next(error)
    }
}

const deleteVariant = async (req,res,next) => {

    try {

        const variantID = req.query.id
        await variantDB.findByIdAndDelete(variantID)
         
    } catch (error) {
        next(error)
    }
}


const updateVariant = async(req,res,next) => {
    try {

            const variantID = req.query.id
            const{variantName,price,color,stock,ram,phoneMemory,size} = req.body;
                 
            let images =[];


            // Retrieve old image names
            for (let i = 0; i < 3; i++) {

                images.push(req.body[`oldImage${i}`]);

            }

            // Update images array with new uploads if they exist
            if(req.files) {

                req.files.forEach(file => {
                    
                    const index=parseInt(file.fieldname.replace('image',''));
                    images[index]=file.filename;
                });
            }

            await variantDB.findByIdAndUpdate(variantID, {
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

            
    } catch (error) {
        next(error)
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