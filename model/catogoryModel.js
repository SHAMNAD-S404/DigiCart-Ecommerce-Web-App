const mongoose = require('mongoose')

const categorySchema  = mongoose.Schema({

        name :{
            type :String,
            required : true
        },

        description : {
            type : String,
            required :true
        },

        imageUrl :{
            type : String,
            required : true
        },

        block :{
            type : Boolean,
            default : false
        },

        offer:{
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'offerModel'

        }

})

module.exports = mongoose.model('catogoryModel',categorySchema);