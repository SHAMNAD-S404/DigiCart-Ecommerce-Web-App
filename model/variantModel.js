const mongoose = require('mongoose')

const variantSchema = new mongoose.Schema({

    productID : {
        type : mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required : true
    },
    
    variantName :{
        type : String,
        required : true

    },

    price : {
        type : Number,
        
        required : true
    },

    color : {
        type : String,
        required : true
    },

    stock:{
        type : Number,
        required : true
    },


    ram : {
        type : String
    },

    phoneMemory : {
        type : String 
    },

    block :{
        type : Boolean,
        default : false
    },

    size :{
        type : String,
        default :'free size'
    },
    imageName :{
        type : Array,
        required : true
       
    },
    offerDiscount:{
        type:Number      
    },
    productName:{

        type:String,
        required : true
    },
    categoryName:{
        
        type:String,
        required:true
    },
    brandName:{

        type:String,
        required:true
    }




},
{timestamps:true})

module.exports = mongoose.model('Variant',variantSchema)