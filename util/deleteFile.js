const file = require ('fs')
const path = require ('path')

//const fileDelete = function (fileName){
//    if(!Array.isArray(fileName)){
//        fileName =[fileName];
//    }

//    fileName.forEach(element => {
//        const filePath = path.join(__dirname,'../public/uploaded_Images',fileName)

//        file.unlink(filePath,(err) =>{
//        if(err){
//            console.error(err);
//        }else{
//            console.log("deleted success");
//        }
//    });
//});



//}
const fileDelete=function (fileNames) {
    if(!Array.isArray(fileNames)) {
        fileNames=[fileNames];
    }

    fileNames.forEach(fileName => {
        const filePath=path.join(__dirname,'../public/uploaded_Images',fileName);
        file.unlink(filePath,(err) => {
            if(err) {
                console.error(err);
            } else {
                console.log("deleted success");
            }
        });
    });
}



module.exports = fileDelete