
const couponDB = require ('../../model/couponModel')



    const loadCouponPage = async (req,res,next) => {
        try {

            const page  = parseInt(req.query.page) || 1 ;
            const limit = 4;
            const skip  = (page-1)*limit;

            const couponData = await couponDB.find().skip(skip).limit(limit);
            const totalCoupons = await couponDB.countDocuments();
            const totalPages  = Math.ceil(totalCoupons/limit);
            res.render('couponManagement',{couponData,currentPage:page,totalPages})
            
        } catch (error) {
            next(error)
        }
    }

    //LOAD ADD COUPON PAGE 
    const loadAddCoupon = async (req,res,next) => {
        try {

            res.render('addCoupon')
            
        } catch (error) {
            next(error)
        }
    }

    //ADD COUPONS
    const addCoupons = async (req,res,next) =>{
        try {
            const {couponCode,discription,discountPercentage,
                minPurchaseAmount,maxDiscountAmount,expiryDate}=req.body;

            const couponRegex=/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}; ':"\\|,.<>/?]{4,15}$/
            const discriptionRegex=/^[a-zA-Z0-9][a-zA-Z0-9 ]{4,60}[a-zA-Z0-9]$/;
            const discountRegex=/^(10|[1-6][0-9]|70)$/
            const amountRegex=/^[1-9][0-9]*$/
            const dateRegex=/^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-(\d{4})$/

            //VALIDATION
            if (!couponRegex.test(couponCode)) {
                return res.status(400).json({error:'Validation failed'})
            }else if (!discriptionRegex.test(discription)) {
                return res.status(400).json({error: 'Validation failed'})
            }else if (!discountRegex.test(discountPercentage)) {
                return res.status(400).json({error: 'Validation failed'})
            }else if (!amountRegex.test(minPurchaseAmount)) {
                return res.status(400).json({error: 'Validation failed'})
            }else if (!amountRegex.test(maxDiscountAmount)) {
                return res.status(400).json({error: 'Validation failed'})
            }else if (!dateRegex.test(expiryDate)) {
                return res.status(400).json({error: 'Validation failed'})
            }

            //CHECKING COUPON CODE ALREADY EXIST
            const regexPattern=new RegExp(`^${couponCode}$`,'i')
            const alreadyExist=await couponDB.aggregate([{$match: {couponCode: regexPattern}}])

            if(alreadyExist.length>0) {

                return res.status(401).json({error:' Coupon code already exist'})
            }

            const insertCoupon = new couponDB({
                couponCode,
                discription,
                discountPercentage,
                minPurchaseAmount,
                maxDiscountAmount,
                expiryDate
            })

            const data = insertCoupon.save()
            if (data) {
                return res.status(200).json({success: 'Successfully Added'})
            } else {
                return res.status(400).json({error: 'something went wrong plz try again'})
            }


            
        } catch (error) {
            next(error)
        }
    }

    //BLOCK COUPON
    const blockCoupon = async (req,res,next) => {
        try {
            const{couponID}=req.body
            const authCheck = await couponDB.findById(couponID).select('_id')
            if (authCheck) {
                await couponDB.findByIdAndUpdate(couponID,{ block:true })
                   
                return res.status(200).json({success: 'Coupon Deactivated successfully'})          
            }else{
                return res.status(400).json({error: 'Invalid Operation'})  
            }


        } catch (error) {
            next(error)
        }
    }


    //UNBLOCK COUPON
    const unblockCoupon = async (req,res,next) => {
        try {
           
            const{couponID}=req.body
            const authCheck = await couponDB.findById(couponID).select('_id')
            if (authCheck) {
                await couponDB.findByIdAndUpdate(couponID,{ block:false })
                   
                return res.status(200).json({success: 'Coupon Activated successfully'})          
            }else{
                return res.status(400).json({error: 'Invalid Operation'})  
            }


        } catch (error) {
            next(error)
        }
    }

    //DELETE COUPON
    const removeCoupon = async (req,res,next) => {
        try {

            const couponID=req.query.id
            const authCheck = await couponDB.findById(couponID).select('_id')
            if(authCheck){
                await couponDB.findByIdAndDelete(couponID)
                return res.status(200).json({success: 'Coupon deleted successfully'})  

            }else{
                return res.status(400).json({error: 'Invalid Operation'})  
            }
            

        } catch (error) {
            next(error)
        }
    }

    //LOAD EDIT COUPON
    const loadEditCoupon = async (req,res,next) => {
        try {
            
            if (req.query.id) {
                const couponID=req.query.id
                const data = await couponDB.findById(couponID)
                if (data) {
                    return res.status(200).render('editCoupon',{data})
                }else{
                    return res.status(404).redirect('/admin/home')
                }
                               
            }else{
                return res.status(404).redirect('/admin/home') 
                
            }

            
        } catch (error) {
            next(error)
        }
    }

    //UPDATE COUPON

const updateCoupons = async (req,res,next) => {
    try {
        const {couponID,couponCode,discription,discountPercentage,
            minPurchaseAmount,maxDiscountAmount,expiryDate}=req.body;

        const authCheck = await couponDB.findById(couponID).select('_id')
        if (!authCheck) {
            return res.status(404).json({error: 'Invalid operation'})
        }    

        const couponRegex=/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{}; ':"\\|,.<>/?]{4,15}$/
        const discriptionRegex=/^[a-zA-Z0-9][a-zA-Z0-9 ]{4,60}[a-zA-Z0-9]$/;
        const discountRegex=/^(10|[1-6][0-9]|70)$/
        const amountRegex=/^[1-9][0-9]*$/
        const dateRegex=/^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-(\d{4})$/

        //VALIDATION
        if(!couponRegex.test(couponCode)) {
            return res.status(400).json({error: 'Validation failed'})
        } else if(!discriptionRegex.test(discription)) {
            return res.status(400).json({error: 'Validation failed'})
        } else if(!discountRegex.test(discountPercentage)) {
            return res.status(400).json({error: 'Validation failed'})
        } else if(!amountRegex.test(minPurchaseAmount)) {
            return res.status(400).json({error: 'Validation failed'})
        } else if(!amountRegex.test(maxDiscountAmount)) {
            return res.status(400).json({error: 'Validation failed'})
        } else if(!dateRegex.test(expiryDate)) {
            return res.status(400).json({error: 'Validation failed'})
        }

        //CHECKING COUPON CODE ALREADY EXIST
        const regexPattern=new RegExp(`^${couponCode}$`,'i')
        const alreadyExist=await couponDB.findOne({couponCode:couponCode})

        if(alreadyExist) {
            if (alreadyExist._id.toString() !== couponID.toString()) {
                 return res.status(401).json({error: ' Coupon code already exist'})
            }          
        }
        //UPDATE DATABASE 
        const update = await couponDB.findByIdAndUpdate(couponID,
            {couponCode:couponCode,discription:discription,
             discountPercentage:discountPercentage,minPurchaseAmount:minPurchaseAmount,
             maxDiscountAmount:maxDiscountAmount,expiryDate:expiryDate },  
            {new:true});
        
        if (update) {
            return res.status(200).json({success: 'Coupon updated successfully'})  
        }else{
            return res.status(400).json({error: 'Something went wrong! Pleace try agian later'})  
        }


    } catch(error) {
        next(error)
    }
}




    module.exports = {
        loadCouponPage,
        loadAddCoupon,
        addCoupons,
        blockCoupon,
        unblockCoupon,
        removeCoupon,
        loadEditCoupon,
        updateCoupons
    }