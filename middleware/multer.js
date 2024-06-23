
const multer=require('multer');
const path=require('path');
const { v4:uuidv4 } = require('uuid')
 
const storage=multer.diskStorage({
    destination: function (req,file,cb) {
        // Specify the upload directory
        cb(null,'public/uploaded_Images');
    },
    filename: function (req,file,cb) {
        // Define the file name format
        const ext = path.extname(file.originalname);
        const uniqueFilename = uuidv4() + ext;
        cb(null,uniqueFilename);
    }
});

    const fileFilter = function (req,file,cb){
        //Allowed MIME TYPE
        const allowedTypes = ['image/jpeg','image/jpg','image/png'];

        if(allowedTypes.includes(file.mimetype)){
            //Accept the file
            cb(null,true)
        }else{
            //Reject file
            cb(new Error('Only image files are allowed !'),false)
        }
    }

// Create a multer instance with the storage strategy
const upload = multer({storage: storage, fileFilter:fileFilter});

module.exports = upload

