const mongoose = require ('mongoose')

const cartSchema = new mongoose.Schema({

    userId :{
        type     : mongoose.Schema.Types.ObjectId,
        ref      : 'userData',
        required : true
    },

    products :[{
        productVariantId : {
            type     : mongoose.Schema.Types.ObjectId,
            ref      : 'Variant',
            required : true
        },

        quantity :{
            type    : String,
            default : 1
        }
    }]

    },
    {timestamps:true})

    module.exports = mongoose.model ('cartModel',cartSchema);