const nodemailer = require('nodemailer')
const otpModel = require('../model/otpModel');
                require('dotenv').config()


const sendOtp=async (email) => {
    const transporter=nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: 465,
        secure: true, 
        auth: {
            user: process.env.SMPT_USER,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    const otp=`${("000000"+Math.floor(Math.random()*1000000)).slice(-6)}`

    const info = await transporter.sendMail({
        from: process.env.SMPT_USER, // sender address
        to: email, // list of receivers
        subject: "Registration", // Subject line
        text: "Hello world?", // plain text body
        html: `<b>otp is ${otp}</b>`, // html body
    });

    const userOtp=new otpModel({
        email: email,
        otp: otp,
        createdAt: Date.now(),
        expiresAt: Date.now()+20000

    })
    console.log(`Otp sended:${otp}` )
  
     await otpModel.insertMany(userOtp);
    

}


module.exports=sendOtp