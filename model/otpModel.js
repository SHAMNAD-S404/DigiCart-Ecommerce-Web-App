const mongoose = require('mongoose')


const OTPschema = new mongoose.Schema({
        userId : {
            type : mongoose.Schema.Types.ObjectId
        },

        otp :{
            type : Number
        },

        email :{
            type : String
        },
        createdAt : {

            type : Date ,
            expires : '120s',
            default : Date.now,
         }
})

    OTPschema.index({createdAt : 1}, {expireAfterSeconds : 120});

module.exports = mongoose.model("OTP",OTPschema)