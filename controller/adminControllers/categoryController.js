const {name}     = require('ejs');
const file       = require('fs')
const path       = require('path')
const sharp      = require('sharp')
const categoryDB = require('../../model/catogoryModel')


const loadCategory = async (req,res)=> {
        try {

            const alert = req.flash('alert')
            res.render('addCategory',{alert})
        } catch (error) {
            console.log(error);
            return res.status(500).redirect('/admin/error')
        }
}

const showCategory = async(req,res) => {
        
        try {
            const success = req.flash('success')
            const categories=await categoryDB.find({})
            res.render('showCategory',{categories,success})
            
            
        } catch (error) {
            console.log(error);
            return res.status(500).redirect('/admin/error')
        }
}

const insertCategory=async (req,res) => {

    try {
        
        const {category,description} = req.body
        const regexPattern = new RegExp(`^${category}$`,'i')
        const alreadyExist = await categoryDB.aggregate([{$match:{name:regexPattern}}])

        if(alreadyExist.length > 0){
         
            return res.status(401).json({success:false,message:'already exists'})

        }else{
                    //Resize the image 

            const resizedImage = await sharp(req.file.path)
                    .resize({width:600, height:450})
                    .png({quality: 90,background: {r: 255,g: 255,b: 255,alpha: 0}})
                    .toBuffer()

                    //Save the resized image

                const newPath = 'public/uploaded_Images/resized'+ req.file.filename;
                console.log('resized worked');
                await sharp(resizedImage).toFile(newPath);   
                const fileName=path.basename(newPath);
                
                const newCategory = new categoryDB({
                        name : category,
                        description : description,
                        imageUrl : fileName,
                      
        })

        const save = await newCategory.save()
        
        console.log(save)
            res.status(200).json({success: true,message: 'Category added'})
    }
      
    } catch(error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
        
    }
};



const deleteCategory = async (req,res) => {

    try {
        const categoryID = req.query.id 
        const removeCategory = await categoryDB.findByIdAndDelete(categoryID)
        if (removeCategory) {
         console.log('deleted success');
        

        }else{
            console.log('deletion failed');
          //  return res.redirect('/admin/delete-category')
        }

    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const editCategory = async(req,res) => {

    try {
        const categoryID = req.query.id
        const categoryData = await categoryDB.findById(categoryID)
        res.render('editCategory',{categoryData})

    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}


const updateCategory = async (req,res) => {

    try {
        const {id,category,description,oldImage}  = req.body
        let imageName ;
        const existingCategory=await categoryDB.findOne({name: category});
       
        if(existingCategory&&(existingCategory._id.toString()!==id||existingCategory.name.toLowerCase()!==category.toLowerCase())) {
            console.log('Category name already exists');
            return res.status(401).json({success: false,message: 'Category name already exists'});
        }
        else{
        
        if(req.file) {
            imageName=req.file.filename
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
        } else {
            imageName=oldImage
        }

        const categoryUpdate = await categoryDB.findByIdAndUpdate({_id:id},
                            {$set:{name:category,
                            description:description,
                            imageUrl:imageName}})

        //res.redirect('/admin/category_management')
        res.status(200).json({success:true,message:'updated success'})

        }
    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const blockCategory = async(req,res) => {

    try {
        
        const categoryID = req.query.id
        const block = await categoryDB.updateOne({_id:categoryID},{$set:{block:true}})
        //res.redirect('/admin/category_management')

    } catch (error) {
        console.log(error);
        return res.status(500).redirect('/admin/error')
    }
}

const unblockCategory = async(req,res) => {

        try {

            const categoryID = req.query.id
            const unblock = await categoryDB.updateOne({_id:categoryID},{$set:{block:false}})
            //res.redirect('/admin/category_management')

            
        } catch (error) {
            console.log(error);
            return res.status(500).redirect('/admin/error')
        }
}


module.exports ={
    loadCategory,
    insertCategory,
    showCategory,
    deleteCategory,
    editCategory,
    updateCategory,
    blockCategory,
    unblockCategory
}