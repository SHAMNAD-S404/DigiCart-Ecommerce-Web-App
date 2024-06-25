   
   //Requiring Nessesery Modules
    const bcrypt     = require ('bcrypt');
    const userDetails= require ('../../model/userModel');
    const otpModel   = require ('../../model/otpModel')
    const addressDB  = require ('../../model/addressModel')   
    const util       = require ('../../util/sendMail')
    const wishlistDB = require ('../../model/wishlistModel')
    const walletDB   = require ('../../model/walletModel')
    require ('dotenv').config()






    //hash the password
    const securePassword = async(password,next) => {

        try {
            const passwordHash = await bcrypt.hash(password,10);
            return passwordHash;
        } catch (error) {
            next(error)
        }
    }

// Function to generate a unique referral code
const generateUniqueReferralCode = async () => {

    const characters='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referralCode;
    let isUnique=false;

    while(!isUnique) {
        referralCode='';
        for(let i=0;i<15;i++) {
            referralCode+=characters.charAt(Math.floor(Math.random()*characters.length));
        }

        const existingCode=await userDetails.findOne({'referral.code': referralCode}).select('_id')
        if(!existingCode) {
            isUnique=true;
        }
    }

    return referralCode;
};




    const insertUser = async(req,res,next) => {

        try {
                const{name, email, phone, password, confirmPassword} = req.body 
                const validEmail = email.toLowerCase();
                const isExistingUser = await userDetails.findOne({email:validEmail})
                const existingNumber = await userDetails.findOne({phone:phone})

            if (isExistingUser){

                req.flash('alert',"User with this email id already exist.Try with another email");
            
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
                util(userEmail)
                res.render('otp',{userEmail})


        } catch (error) {
            next(error)
        }
    
    }


    const verifyOtp = async (req,res,next) => {
    
        try {
            
            if(!req.body) {
                return  res.status(400).render('otp',{mailId,message : "Please enter the otp"})
            }
            const mailId=req.session.email_id;
            const value = await otpModel.findOne({email:mailId})

            const otp = parseFloat(req.body.otp.join(""));
            const userData = await otpModel.findOne({_id: value._id})
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
            next(error)
        }
    }

    const verifyLogin = async (req,res,next) => {

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
                next(error)
            }
    }

    //FORGOT PASSWORD CHANGING
    const forgotPass = async (req,res,next) => {
        
            try {
                const {email} = req.body
                const userData = await userDetails.findOne({email:email,isBlocked:false}).select('_id')

                if(userData){
                     util(email)
                     return res.status(200).json({success:`Verification Code Sended to ${email} . `})
                       
                }else{
                    return res.status(401).json({error:'Email Id not found !'})
                }
            } catch (error) {
                next(error)
            }
    }


    //LOAD RESET PASSWORD PAGE 
    const loadResetPassPage = async (req,res,next) =>{

        try {

            const resetData = req.session.resetInfo ;
            if (!resetData) {

                const previousUrl = req.get('referer') || '/login'
                return res.status(400).redirect(previousUrl);

            }else{

                res.render('resetPassword',{resetData})
            }
            
        } catch (error) {
            next(error)
        }
    }


    //VERIFY AND CHANGE PASSWORD
    const resetPassword = async (req,res,next) => {
        try {

            const {otp} = req.body;
            const otpCode = +otp
            const fetchData = await otpModel.findOne({otp:otpCode});

            if (fetchData) {

                const findUser = await userDetails.findOne({email:fetchData.email}).select('email name');
                req.session.resetInfo = findUser;
                return res.status(200).json({success:'OTP VERIFIED . RESET YOUR PASSWORD !'})
                
            }else{
                return res.status(400).json({error:'OTP not Matching !'})
            }
            
        } catch (error) {
            next(error)
        }
    }

    //CHANGING PASSWORD AND UPDATIIN DB
    const updatePassword = async (req,res,next) => {
        try {
            const {userID,newPassword} = req.body
            const authCheck = await userDetails.findOne({_id:userID}).select('_id');
            const passwordRegex=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

            if (!passwordRegex.test(newPassword)) {
                return res.status(400).json({error: 'Enter Valid Password !'}) 
            }
            
            if (authCheck) {

                const newPass = await securePassword(newPassword)

                await userDetails.findByIdAndUpdate(authCheck._id,
                                {$set:{password:newPass}});

                //DELETING SESSION DATA 
                delete req.session.resetInfo ;

                return res.status(200).json({success: 'Password Changed ! Kindly Login with your new password'});
                
            }else{
                return res.status(400).json({error: 'User not found !'}) 
            }
            
        } catch (error) {
            next(error)
        }
    }



    const resendOTP = async(req,res,next) => {

            try {
                
                const userEmail = req.session.email_id;

                await Promise.all([
                 otpModel.deleteOne({email:userEmail}) ,       
                 util(userEmail)
                 
                ]);

                res.render('otp')

            } catch (error) {
                next(error)
            }

        
    }

    const logout = async(req,res,next) => {

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
                next(error)
            }
    }

    
        //USERPROFILE SESSION LOADING
        const userProfile = async (req,res,next) => {

            try {
                const userID   = req.session.login_id;
                const username = await usernameFinder(userID)
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


                if (!wishlistItems) {

                   return res.render('userProfile',{
                       userData,addressData,username,
                       wishlistItems,totalPages:0,currentPage:page });
                }

                const totalProduct=wishlistItems.variantId.length
                const totalPages   = Math.ceil(totalProduct/limit)
                const paginatedProducts=wishlistItems.variantId.slice(skip,skip+limit) 

                res.render('userProfile',{
                    userData,addressData,wishlistItems: paginatedProducts,username,
                    totalPages,currentPage:page })
                
                
            } catch (error) {
                next(error)
            }
        }


        //UPDATE USER PROFILE
        const updateUserProfile = async (req,res,next) => {
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
                next(error)
            }
            
        }


        const changePassword = async(req,res,next) => {
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
                next(error)
            }
        } 


        //ADD USER ADDRESS

        const addAddress = async (req,res,next) => {
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
                next(error)
            }
        }

    //DELETE ADDRESS
    const deleteAddress = async (req,res,next) => {
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
            next(error)
        }
    }

    //USER ADDRESS UPDATION
    const updateAddress = async (req,res,next) => {

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
                next(error)
        }
    }

    //GENERATE REFFERAL CODE 

    const generateReferral = async (req,res,next) => {
        try {
            const userID = req.session.login_id;
            const user=await userDetails.findById(userID).select('referral');
 
            if(user&&user.referral&&user.referral.code) {
                return res.status(400).json({error: 'Already have a Referral Code!'});
            }

            // Generate a unique referral code
            const referralCode=await generateUniqueReferralCode();

            // Update the user's referral code
            await userDetails.findByIdAndUpdate(
                userID,
                {$set: {'referral.code': referralCode}},
                {upsert: true,new: true}
            );

            return res.status(200).json({referralCode,success: 'Referral Code Created'});

        } catch (error) {
            next(error)
        }
    }

    
    //APPLY REFERRAL CODE
    const applyReferral = async (req,res,next) => {
        try {
            const userID = req.session.login_id;
            const {referralCode} = req.body
            const regex = /^[A-Za-z0-9]{15}$/

            if (!regex.test(referralCode)) {
                return res.status(400).json({error: 'Enter a valid Referral code !'});  
            }

            const user = await userDetails.findById(userID).select('referral');

            if(user&&user.referral&&user.referral.claimed === true ) {
                return res.status(400).json({error: 'Already Claimed Reward !'});
            }

            const searchReferrer = await userDetails.findOne({'referral.code':referralCode}).select('_id ')

            if (!searchReferrer) {
                return res.status(400).json({error: 'Referral Code not a Valid !'});
            }else{

                const referrer = searchReferrer._id

                if (referrer.toString() === userID.toString()) {
                    return res.status(400).json({error: 'Referral Code can not apply on self !'});
                }
               
                //CREDITING BONUS TO REFERRER WALLET
                await Promise.all([

                    walletDB.findOneAndUpdate({userID: referrer},
                        {
                            $push: {
                                transactions: {
                                    amount: 200,
                                    transactionMethod: 'Referral'
                                }
                            },
                            $inc: {balance: 200}
                        },{upsert: true}),
                    
                    //CREDITING BONUS TO REFERRE WALLET
                    walletDB.findOneAndUpdate({userID: userID},
                        {
                            $push: {
                                transactions: {
                                    amount: 100,
                                    transactionMethod: 'Referral'
                                }
                            },
                            $inc: {balance: 100}
                        },{upsert: true}),
                    
                    //UPDATION USER FIELD
                    userDetails.findByIdAndUpdate(userID,
                                {$set: {'referral.claimed': true}},
                                {upsert:true})
                 ])            

                return res.status(200).json({success: 'Referrel bonus Claimed and Credited to your wallet'});    

            }


        } catch (error) {
            next(error)
        }
    }

    const usernameFinder = async(userID) => {
        try {

            const username=await userDetails.findOne({_id: userID}).select('-_id name')
            return username;

        } catch (error) {
            next(error)
        }
    }


    
        
  

//********************************************************************************************************************* */ 

    // GOOGLE AUTH SETTING
    const successGoogleLogin = async (req,res,next) => {
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
                        req.session.login_id = addUser._id; 
                        res.status(200).redirect('/user-profile')
                    }
                
             
            }else{
                res.redirect('/failure')
            }

        } catch(error) {
            next(error)

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
        generateReferral,
        applyReferral,
        resetPassword,
        loadResetPassPage,
        updatePassword,
        usernameFinder,

        successGoogleLogin,
        failureGoogleLogin
    }
