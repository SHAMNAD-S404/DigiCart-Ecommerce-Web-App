const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({

    offerName:{
       type:String,
       required:true 
    },

    offerType:{
        type:String,
        enum: ['Category Offer','Product Offer'],
        required:true
    },

    discountPercentage:{
        type:Number,
        required:true
    },

    discription: {
        type: String,
        required: true
    },

    block: {
        type: Boolean,
        default: false
    },

    expiryDate: {
        type: String,
        required: true
    },

    productID:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        }
    ],
    categoryID:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'catogoryModel',
            required:true
        }
    ],
    offerItems:{
        type:String,
        required:true
    }




},{timestamps:true})

module.exports = mongoose.model('offerModel',offerSchema);