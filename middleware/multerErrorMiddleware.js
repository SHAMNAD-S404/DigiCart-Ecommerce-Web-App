
 const multer = require('multer')

 const handleMulterError = (err,req,res,next) => {
    if (err instanceof multer.MulterError) {

        //When a multer error occured while file uploading 
        //return res.status(400).send({error:err.message});
        console.log(err.message);
        
    }else if (err) {
        //An a unknown error occured when uploading
        //return res.status(400).send({error:err.message})
        console.log(err.message);
    }
    next ();
 }

 module.exports = handleMulterError;