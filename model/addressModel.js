const mongoose = require ('mongoose')

const addressSchema = new mongoose.Schema({


    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "userData",
        required : true
    },
    address : [{
            name: {
                type: String,
                required: true
            },

            phone: {
                type: Number,
                required: true
            },

            pincode: {
                type: Number,
                required: true
            },

            locality: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            },

            landmark: {
                type: String,
                required: true
            },

            addressType: {
                type: String,
                required: true
            }

        }],

   


},{timestamps:true})

module.exports = mongoose.model('Address',addressSchema);