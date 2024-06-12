
const mongoose = require ('mongoose')

const wihlistSchema = new mongoose.Schema({

    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userData',
        required : true
    },
    variantId :[{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Variant',
        required : true
    }]
},
    {timestamps:true})

module.exports=mongoose.model('wishlist',wihlistSchema)