const nodemailer=require('nodemailer')
const otpModel=require('../model/otpModel');
require('dotenv').config()

const sendOtp=async (email) => {
    try {
        const transporter=nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMPT_USER,
                pass: process.env.SMPT_PASSWORD,
            },
        });

        const otp=`${("000000"+Math.floor(Math.random()*1000000)).slice(-6)}`;

        const info=await transporter.sendMail({
            from: process.env.SMPT_USER, // sender address
            to: email, // list of receivers
            subject: "DigiCart Ecom Registration OTP", // Subject line
            text: `Hello,
            Thank you for registering with DigiCart Ecom!
            Your One-Time Password (OTP) is ${otp}. Please enter this code on the registration page to continue the process.
            If you did not request this email, please ignore it.
            Best regards,
            The DigiCart Ecom Team`, // plain text body
            html: `<p>Hello,</p>
            <p>Thank you for registering with <strong>DigiCart Ecom</strong>!</p>
            <p>Your One-Time Password (OTP) is <strong>${otp}</strong>. Please enter this code on the registration page to continue the process.</p>
            <p>If you did not request this email, please ignore it.</p>
            <p>Best regards,<br>The DigiCart Ecom Team</p>`, // html body
        });

        const userOtp=new otpModel({
            email: email,
            otp: otp,
            createdAt: Date.now(),
            expiresAt: Date.now()+20000,
        });
        console.log(`OTP sent: ${otp}`);

        await otpModel.insertMany(userOtp);
    } catch(error) {
        console.error(`Error sending OTP: ${error.message}`);
        // Handle specific errors if needed
    }
};



module.exports=sendOtp