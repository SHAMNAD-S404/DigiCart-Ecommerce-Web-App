    //Requiring Nessesery Modules
    const bcrypt     = require ('bcrypt');
    const userDetails= require ('../../model/userModel');
    const otpModel   = require ('../../model/otpModel')
    const addressDB  = require ('../../model/addressModel')   
    const util       = require ('../../util/sendMail')
    const categoryDB = require ('../../model/catogoryModel')
    const productDB  = require ('../../model/productModel');
    const variantDB  = require ('../../model/variantModel')
    const cartDB     = require ('../../model/cartModel')
    const orderDB    = require ('../../model/orderModel')
    const wishlistDB = require ('../../model/wishlistModel')
    const couponDB   = require ('../../model/couponModel')
    const walletDB   = require ('../../model/walletModel')


    require ('dotenv').config()
    const path       = require ('path');

    

    ////rechek needed
    //const {name}=require('ejs');
    //const {error}=require('console');
    //const {stat}=require('fs');
    //const {model}=require('mongoose');




    //hash the password
    const securePassword = async(password) => {

        try {
            const passwordHash = await bcrypt.hash(password,10);
            return passwordHash;
        } catch (error) {
            console.log(error.message);
            return res.status(500).redirect('/error')
        }
    }




    const insertUser = async(req,res) => {

        try {
                const{name, email, phone, password, confirmPassword} = req.body 
                const validEmail = email.toLowerCase();
                const isExistingUser = await userDetails.findOne({email:validEmail})
                const existingNumber = await userDetails.findOne({phone:phone})

            if (isExistingUser){

                req.flash('alert',"User with this email id already exist.Try with another email");
                console.log('already usser');
            
                return res.status(400).redirect('/signup')
            }else if (existingNumber) {
                req.flash('alert',"User with this phone number already exist.Try with another phone number");
                return res.status(400).redirect('/signup')
            }

            const spassword = await securePassword(password)
            const user = new userDetails({

                name : name,
                email : validEmail,
                phone : phone,
                password : spassword,
                isAdmin : false,
                isVerified : false,
                isBlocked :false
            })

                req.session.userData = user
                req.session.email_id = req.body.email
                const userEmail = req.session.email_id
                await util(userEmail)
                res.render('otp',{userEmail})


        } catch (error) {
                console.log('error in insertData :',error);
                return res.status(500).redirect('/error')
        }
    
    }


    const verifyOtp = async (req,res) => {
    
        try {
            
            if(!req.body) {
                return  res.status(400).render('otp',{mailId,message : "Please enter the otp"})
            }
            const mailId=req.session.email_id;
            const value = await otpModel.findOne({email:mailId})
            req.session.otpID = value._id;

            const otp = parseFloat(req.body.otp.join(""));
            console.log(req.session.otpID)
            const userData = await otpModel.findOne({_id: req.session.otpID})
            const userOTP = userData.otp

            if(otp == userOTP){
                const storeUser = req.session.userData
                storeUser.isVerified = true;
                await userDetails.create(storeUser);
                req.flash('success','Account Created Success fully Please login with your email and password')
                return res.status(200).redirect('/login')

            }else{
                res.status(400).render('otp',{mailId,message:"Incorrect user"})
                
            }
            

            
        } catch (error) {
            console.log('error in verifyOtp',error);
            return res.status(500).redirect('/error')
        }
    }

    const verifyLogin = async (req,res) => {

            try {
                const {email: userEmail, password : userPassword} = req.body
                const loginData = await userDetails.findOne({ email:userEmail })
                
                    if(loginData){
                            const passwordMatch = await bcrypt.compare(userPassword,loginData.password)
                                if(passwordMatch){
                                    if(loginData.isBlocked == false){
                                        

                                            req.session.regenerate((err) => {
                                            if(err) {
                                                return res.status(500).send('Failed to regenerate session');
                                            }

                                            req.session.login_id=loginData._id; 

                                            req.flash('success','Login successful')                             
                                            res.redirect('/user-profile') 
                                        });

                                            //req.session.login_id = loginData._id; 
                                                                                
                                            //req.flash('success','Login successful')                             
                                            //res.redirect('/user-profile') 
                                            
                                    }else{
                                            req.flash('messages','Your account is blocked');
                                            return res.status(401).redirect('/login')
                                        
                                    }                       
                                }else{
                                req.flash('messages','email or password incorrect')
                                return res.status(401).redirect('/login')
                                }
                    }else{
                        req.flash('messages','email or password incorrect')
                        return res.status(401).redirect('/login')
                    }
                
            } catch (error) {
                console.log('error in verifyLogin section',error);
                return res.status(500).redirect('/error')
            }
    }

    const forgotPass = async (req,res) => {
        
            try {
                const userEmail = req.body.email
                const userData = await userDetails.findOne({email:userEmail , isBlocked:false})
                if(userData){
                        res.session.forgot_id = userData._id
                }
            } catch (error) {
                console.log('error in forgotPass', error);
                return res.status(500).redirect('/error')
            }
    }

    const resendOTP = async(req,res) => {
            try {
                
                const userEmail = req.session.email_id;
                await otpModel.deleteOne({email:userEmail})        
                await util(userEmail)
                res.render('otp')
            } catch (error) {
                console.log("error in resendOTP",error);
                return res.status(500).redirect('/error')
            }

        
    }

    const logout = async(req,res) => {

            try {

            
                req.flash('success','Logout sucessfully');

                req.session.destroy((err) => {
                    if(err) {
                        console.log(err);
                        return res.status(500).redirect('/error');
                    }

                    res.redirect('/login');
                });
        
            

            } catch (error) {
                console.log(error);
                return res.status(500).redirect('/error')
            }
    }

    
        //USERPROFILE SESSION LOADING
        const userProfile = async (req,res) =>{

            try {
                const userID = req.session.login_id;
                const userData = await userDetails.findById(userID)
                const addressData = await addressDB.find({userId:userID})

                //PAGINATION CODE
                const page = parseInt(req.query.page)||1;
                const limit = parseInt(req.query.limit) || 10
                const skip = parseInt(page - 1)*limit;

                const wishlistItems = await wishlistDB.findOne({userId:userID}).populate({
                    path:'variantId',
                    model:'Variant',
                    populate : {
                        path:'productID',
                        model:'Product' }
                   
                    }).sort({createdAt:-1})

                        
                const coupons = await couponDB.find({block:false}).sort({createdAt:-1})

                if (!wishlistItems) {
                   return res.render('userProfile',{userData,addressData,wishlistItems,coupons,totalPages:0,currentPage:page})
                }

                const totalProduct=wishlistItems.variantId.length
                const totalPages   = Math.ceil(totalProduct/limit)
                const paginatedProducts=wishlistItems.variantId.slice(skip,skip+limit) 

                res.render('userProfile',{userData,addressData,wishlistItems: paginatedProducts,coupons,totalPages,currentPage:page})
                
                
            } catch (error) {
                console.log(error);
                return res.status(500).redirect('/error')
            }
        }


        //UPDATE USER PROFILE
        const updateUserProfile = async (req,res) => {
            try {

                const userID = req.session.login_id;
                const{fullname,phone,gender} = req.body

                //validation
                const fullNameRegex=/^[^\s][a-zA-Z\s]*[^\s]$/;
                const phoneRegex=/^(\+?\d{1,3}[- ]?)?(6|7|8|9)\d{9}$/;

                if(!fullNameRegex.test(fullname)){
                    return res.status(400).json({error:"Enter a valid name"})
                }
                if(!phoneRegex.test(phone)){
                    return res.status(400).json({error:"Enter Valid phone number"})
                }

                const existNumber=await userDetails.findOne({phone: phone})

                if(existNumber && userID !== existNumber._id.toString()){
                    return res.status(400).json({error: "Number already  exist"}) 
                }
                
                const options = {upsert:true}
                await userDetails.updateOne({_id:userID},{$set:{
                                                name:fullname,
                                                phone : phone,
                                                gender : gender
                                                }},options)
                                        
                return res.status(200).json({success:'Updated Successfully'})
                
            } catch (error) {
                console.log(error);
                return res.status(500).redirect('/error')
            }
            
        }


        const changePassword = async(req,res)=>{
            try {
                const userID = req.session.login_id;
                const{currentPass,newPass,confirmPass} = req.body;
                const loginData = await userDetails.findById(userID);
                if(loginData){
                    const passwordMatch = await bcrypt.compare(currentPass,loginData.password)
                        if (passwordMatch) {

                                const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
                                if (!passwordRegex.test(newPass)) {
                                    return res.status(400).json({
                                        error:"Enter a valid password, password must be have upper,lower and number inputs.Length atleast 6"})
                                }

                                //CHECKING CURRENT PASSWORD AND NEW PASSWORD IS SAME 
                                const dupicatePass = await bcrypt.compare(newPass,loginData.password)
                                if (dupicatePass) {
                                    return res.status(400).json({error: "The new password is same to old password.Choose another one !"})
                                }

                                if(newPass !== confirmPass){
                                    return res.status(400).json({error:"Passwords are not matching"})
                                }

                                const spassword2 = await securePassword(newPass)
                                const updatePassword = await userDetails.findByIdAndUpdate(userID,{$set: {password:spassword2}})
                            
                                    if (updatePassword) {
                                        return res.status(200).json({success:'updated successfully, Kindly login with new password'})
                                    }else{
                                        res.status(400).json({error:'Something went wrong !. Try again later'})
                                    }

                        }else{
                            return res.status(400).json({error:"Current Password didn't matching !"})
                        }
                }else{
                    return res.status(400).json({error:"Something went wrong ! Pleace try again later"})
                }

                
            } catch (error) {
                console.error(error);
                return res.status(500).redirect('/error')
            }
        } 


        //ADD USER ADDRESS

        const addAddress = async (req,res)=> {
            try {

                    const userID = req.session.login_id;
                    const{fullname,phone,address,locality,landmark,city,state,pincode,addressType} = req.body;

                    //REEGX VALIDATION
                    const nameRegex     = /^[^\s][a-zA-Z\s]*[^\s]$/;
                    const phoneRegex    = /^(\+?\d{1,3}[- ]?)?(6|7|8|9)\d{9}$/;
                    const addressRegex  = /^[A-Za-z0-9.,' -]{5,}$/;
                    const localityRegex = /^[A-Za-z ]{5,}$/;
                    const landmarkRegex = /^[A-Za-z ]{5,}$/;
                    const cityRegex     = /^[A-Za-z ]{5,}$/;
                    const stateRegex    = /^[A-Za-z ]{5,}$/;
                    const pincodeRegex  = /^[0-9]{1,6}$/;

                    if (!nameRegex.test(fullname) || fullname.length < 4 ) {
                        return res.status(400).json({error:"Input validation failed !"})
                    }
                    if (!phoneRegex.test(phone)) {
                        return res.status(400).json({error:"Input validation failed !"})
                    }
                    if (!addressRegex.test(address)) {
                        return res.status(400).json({error:"Input validation failed !"})
                    }
                    if (!localityRegex.test(locality)) {
                        return res.status(400).json({error:"Input validation failed !"})
                    }
                    if (!landmarkRegex.test(landmark)) {
                        return res.status(400).json({error:"Input validation failed !"})
                    }
                    if (!cityRegex.test(city)) {
                        return res.status(400).json({error:"Input validation failed !"})
                    }
                    if (!stateRegex.test(state)) {
                        return res.status(400).json({error:"Input validation failed !"})
                    }
                    if (!pincodeRegex.test(pincode)) {
                        return res.status(400).json({error:"Input validation failed !"})
                    }

                        const newAddress = {

                            name: fullname,
                            phone: phone,
                            pincode: pincode,
                            locality: locality,
                            address: address,
                            city: city,
                            state: state,
                            landmark: landmark,
                            addressType: addressType
                        };

                    const addressIsExisting = await addressDB.findOne({userId:userID })
                    if (addressIsExisting) {
                            const pushAddress=await addressDB.findOneAndUpdate({userId:userID},{
                                                $push:{address:newAddress}},{new:true} )
                            if (pushAddress) {
                                res.status(200).json({success:"Address added successfully "})
                            }else{
                                res.status(400).json({error: " Failed try Again !"})
                            }
                        
                    } else {
                            const insertAddress = await addressDB.create({
                                                    userId: userID,
                                                    address:newAddress  })
                                if (insertAddress) {
                                    res.status(200).json({success: "Address added successfully "})
                                } else {
                                    res.status(400).json({error: " Failed try Again !"})
                                }
                                                
                    }
                            
            } catch (error) {
                console.error(error);
                return res.status(500).redirect('/error')
            }
        }

    //DELETE ADDRESS
    const deleteAddress = async (req,res) => {
        try {
            const userID    = req.session.login_id;
            const addressID = req.body.addressID;
            const authCheck = await addressDB.findOne({userId:userID,
                            address:{$elemMatch:{_id:addressID}}  })

            if (authCheck) {
                await addressDB.findOneAndUpdate({userId:userID},
                                        {$pull: {address:{
                                        _id:addressID  }}},
                                        {new:true}   );

                res.status(200).json({success:"Successfully deleted"})
                
            }else{
                res.status(400).json({error:"Validation failed"})
            }


        } catch (error) {
            console.error(error);
            return res.status(500).redirect('/error')
        }
    }

    //USER ADDRESS UPDATION
    const updateAddress = async (req,res) => {

            try {
        
                const userID = req.session.login_id;      
                const {fullname,phone,address,locality,landmark,city,state,pincode,addressType,addressID} = req.body;

                //REEGX VALIDATION
                const nameRegex     =   /^[^\s][a-zA-Z\s]*[^\s]$/;
                const phoneRegex    =   /^(\+?\d{1,3}[- ]?)?(6|7|8|9)\d{9}$/;
                const addressRegex  =   /^[A-Za-z0-9.,' -]{5,}$/;
                const localityRegex =   /^[A-Za-z ]{5,}$/;
                const landmarkRegex =   /^[A-Za-z ]{5,}$/;
                const cityRegex     =   /^[A-Za-z ]{5,}$/;
                const stateRegex    =   /^[A-Za-z ]{5,}$/;
                const pincodeRegex  =   /^[0-9]{1,6}$/;

                if(!nameRegex.test(fullname)||fullname.length<4) {
                    return res.status(400).json({error: "Input validation failed !"})
                }
                if(!phoneRegex.test(phone)) {
                    return res.status(400).json({error: "Input validation failed !"})
                }
                if(!addressRegex.test(address)) {
                    return res.status(400).json({error: "Input validation failed !"})
                }
                if(!localityRegex.test(locality)) {
                    return res.status(400).json({error: "Input validation failed !"})
                }
                if(!landmarkRegex.test(landmark)) {
                    return res.status(400).json({error: "Input validation failed !"})
                }
                if(!cityRegex.test(city)) {
                    return res.status(400).json({error: "Input validation failed !"})
                }
                if(!stateRegex.test(state)) {
                    return res.status(400).json({error: "Input validation failed !"})
                }
                if(!pincodeRegex.test(pincode)|| pincode.length <6) {
                    return res.status(400).json({error: "Input validation failed !"})
                }


                const newAddress={

                    name: fullname,
                    phone: phone,
                    pincode: pincode,
                    locality: locality,
                    address: address,
                    city: city,
                    state: state,
                    landmark: landmark,
                    addressType: addressType
                };


                const authCheck = await addressDB.findOne({userId: userID,
                                    address: {$elemMatch:{
                                    _id: addressID}} })
                            
                if(authCheck) {
                    const addressUpdate = await addressDB.findOneAndUpdate({
                                            userId: userID,'address._id':addressID},
                                            { $set: { 'address.$': newAddress} },                                         
                                            {new: true});                                        
                                                
                    res.status(200).json({success: "Successfully Updated"})

                } else {
                    res.status(400).json({error: "Validation failed"})
                }

        
        } catch (error) {
            console.error(error);
            return res.status(500).redirect('/error')
        }
    }
        
  

//********************************************************************************************************************* */ 

    // GOOGLE AUTH SETTING
    const successGoogleLogin = async (req,res) => {
        try {
            
        
            if(req.user){
                const isExistingUser=await userDetails.findOne({email:req.user.email})
                    
                    if (isExistingUser) {
                        req.session.login_id=isExistingUser._id; 
                        res.status(200).redirect('/user-profile')
                        
                    }else{
                        const user=new userDetails({
                            name: req.user.displayName,
                            email: req.user.email,
                            isVerified: true
                        })

                        const addUser=await userDetails.create(user)
                        req.session.login_id=addUser._id; 
                        res.status(200).redirect('/user-profile')
                    }
                
             
            }else{
                res.redirect('/failure')
            }

        } catch(error) {
            console.log(error);

        }  
    
    }    
    


    const failureGoogleLogin = (req,res) => {

        req.flash('alert','Google auth is failed')
        return res.redirect('/login')
    }

//* ****************************************************************************************************************






    module.exports = {

        insertUser,
        otpModel,
        verifyOtp,
        verifyLogin,
        forgotPass,
        resendOTP,
        logout,
        userProfile,
        updateUserProfile,
        changePassword,
        addAddress,
        deleteAddress,
        updateAddress,

        successGoogleLogin,
        failureGoogleLogin
    }
