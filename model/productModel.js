const mongoose = require ('mongoose') ;

const productSchema = new mongoose.Schema ({
    
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "catogoryModel",
        requied: true
    },
    
    name :{
        type : String,
        requied : true
    },

    brand :{
        type : String,
        required : true
    },

    discription :{
        type : String,
        required : true
    },

    imageName :{
        type: String,
        requied : true
    },


    Blocked :{
        type : Boolean,
        default : false
    },

    variants :{
        type : [mongoose.Schema.Types.ObjectId],
        ref: "Variant"
    },
    
    offer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'offerModel'

    },

    categoryName:{
        type : String
    },
    
    }, {timestamps: true})

module.exports = mongoose.model('Product',productSchema);