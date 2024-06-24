
    const path       = require  ('path')
    const sharp      = require  ('sharp')
    const categoryDB = require  ('../../model/catogoryModel')


const loadCategory=async (req,res,next)=> {
        try {

            const alert = req.flash('alert')
            res.render('addCategory',{alert})
        } catch (error) {
            next(error)
        }
}

const showCategory = async(req,res,next) => {
        
        try {
            const success = req.flash('success')
            const categories=await categoryDB.find({})
            res.render('showCategory',{categories,success})
            
            
        } catch (error) {
            next(error)
        }
}

const insertCategory=async (req,res,next) => {

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
                await sharp(resizedImage).toFile(newPath);   
                const fileName=path.basename(newPath);
                
                const newCategory = new categoryDB({
                        name : category,
                        description : description,
                        imageUrl : fileName,
                      
        })

            await newCategory.save()
        
        
            res.status(200).json({success: true,message: 'Category added'})
    }
      
    } catch(error) {
        next(error)
        
    }
};



const deleteCategory = async (req,res,next) => {

    try {
        const categoryID = req.query.id ;

        await categoryDB.findByIdAndDelete(categoryID)
      

    } catch (error) {
        next(error)
    }
}

const editCategory = async(req,res,next) => {

    try {
        const categoryID = req.query.id
        const categoryData = await categoryDB.findById(categoryID)
        res.render('editCategory',{categoryData})

    } catch (error) {
        next(error)
    }
}


const updateCategory = async (req,res,next) => {

    try {
        const {id,category,description,oldImage}  = req.body
        let imageName ;
        const existingCategory=await categoryDB.findOne({name: category});
       
        if(existingCategory&&(existingCategory._id.toString()!==id||existingCategory.name.toLowerCase()!==category.toLowerCase())) {
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

         await categoryDB.findByIdAndUpdate({_id:id},
                            {$set:{name:category,
                                    description:description,
                                    imageUrl:imageName} });

        res.status(200).json({success:true,message:'updated success'})

        }
    } catch (error) {
        next(error)
    }
}

const blockCategory = async(req,res,next) => {

    try {
        
        const categoryID = req.query.id
        await categoryDB.updateOne({_id:categoryID},{$set:{block:true}})


    } catch (error) {
        next(error)
    }
}

const unblockCategory = async(req,res,next) => {

        try {

            const categoryID = req.query.id
            await categoryDB.updateOne({_id:categoryID},
                                {$set:{block:false}});

            
        } catch (error) {
            next(error)
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