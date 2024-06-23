const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    name :{
        type : String,
        required : true
    },

    email :{
        type : String,
        required : true
    },

    phone :{
        type : Number,
        
    },

    password :{
        type : String,
       
    },

    isBlocked :{
        type : Boolean,
        default : false
    },

    isVerified:{
        type : Boolean,
        default : false
    },

    isAdmin :{
        type : Boolean,
        default : false
    },

    gender :{
        type : String
    },

    referral :{
        code:{
            type:String
        },
        claimed:{
            type:Boolean,
            default:false
        }
    }

  

},
    {timestamps: true})


module.exports = mongoose.model('userData',userSchema);