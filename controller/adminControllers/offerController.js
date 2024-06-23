
const offerDB    = require ('../../model/offerModel')
const productDB  = require ('../../model/productModel')
const categoryDB = require ('../../model/catogoryModel')
const variantDB  = require ('../../model/variantModel')

//LOAD OFFER MANAGEMENT PAGE
    const loadOfferPage = async(req,res,next) =>{
        
        try {

            const page  = parseInt(req.query.page) || 1 ;
            const limit = 4;
            const skip  = (page-1) * limit;

            const offers= await offerDB.find().skip(skip).limit(limit)
            const totalOffers = await offerDB.countDocuments();
            const totalPages = Math.ceil(totalOffers/limit)
    
            res.render('offers',{offers,currentPage:page,totalPages})
            
        } catch (error) {
            next(error)
        }
    }


//LOAD ADD OFFER PAGE
    const loadAddOffer = async(req,res,next) => {
        try {

            const category = await categoryDB.find({}).select('name')
            const product  = await productDB.find({}).select('name')
            res.status(200).render('addOffer',{category,product})
            
        } catch (error) {
            next(error)
        }
    }


//INSER OFFER
    const insertOffer = async (req,res,next) => {
        try {
            const { offerType,offerItem,name,
                    discription,percentage,
                    expiryDate,applicableItems } = req.body;

        //DATA VALIDATION

            //REGEX PATTERN FOR CHECKING
            const nameRegex=/^[A-Za-z0-9][A-Za-z0-9 ]{2,20}[A-Za-z0-9]$/
            const discriptionRegex=/^[a-zA-Z0-9][a-zA-Z0-9 ]{4,60}[a-zA-Z0-9]$/;
            const discountRegex=/^(10|[1-6][0-9]|70)$/
            const dateRegex=/^(0?[1-9]|[12][0-9]|3[01])-(0?[1-9]|1[0-2])-(\d{4})$/;


            //EXPIRY DATE CHECKING
            function compareDates(selectedDateValue) {
                const today=new Date().setHours(0,0,0,0);
                const [day,month,year]=selectedDateValue.split('-').map(Number);
                const selectedDate=new Date(year,month-1,day).setHours(0,0,0,0);

                if(today===selectedDate) {
                    return res.status(400).json({error:'Validation error'});
                }
            }

                compareDates(expiryDate);
                
                //VALIDAION TEST
                if (!nameRegex.test(name)) {
                    return res.status(400).json({error: 'Validation error'}); 
                }else if (!discriptionRegex.test(discription)) {
                    return res.status(400).json({error: 'Validation error'});
                }else if (!discountRegex.test(percentage)){
                    return res.status(400).json({error: 'Validation error'});
                }else if(!dateRegex.test(expiryDate)){
                    return res.status(400).json({error: 'Validation error'});
                }
            
            //IF ITS PRODUCT OFFER
            if(offerType==='Product Offer'){

                //PRODUCT EXIST OR NOT
                const authChek = await productDB.findById(offerItem); 

                if (authChek) {
                    
                    const existingOffer = await offerDB.findOne({productID:offerItem}).select('_id');

                    if (existingOffer) {
                        return res.status(400).json({error: 'Product have existing offer'});
                    }else{

                        //UPDATING DATABASE WITH NEW OFFER DATA
                        const newOffer = new offerDB({

                            offerName : name,
                            offerType : offerType,
                            discountPercentage : percentage,
                            discription : discription,
                            expiryDate : expiryDate,
                            productID : offerItem,
                            offerItems : applicableItems


                        });

                            const saveOffer = await newOffer.save();

                            //UPDATE OFFER IN PRODUCT DB
                            await productDB.findByIdAndUpdate(offerItem,
                                        {$set:{offer:saveOffer._id}});

                            //UPDATE IN VARIANT FIELD
                            await variantDB.updateMany({productID:offerItem},
                                {$set: {offerDiscount:percentage }
                                },{upsert:true});


                        return res.status(200).json({success: 'Offer added successfully'});            

                        }

                    }else{

                         return res.status(404).json({error: 'Validation failed'});
                }

                    
                
            
            //IF ITS CATEGORY OFFER
            } else if(offerType==='Category Offer') {
                
                //IF CATEGORY EXIST OR NOT
                const authChek = await categoryDB.findById(offerItem);

                if(authChek){

                    const existingOffer = await offerDB.findOne({categoryID: offerItem}).select('_id');

                    if(existingOffer) {

                        return res.status(400).json({error: 'Category have existing offer'});

                    } else {

                        //UPDATING DATABASE WITH NEW OFFER DATA
                        const newOffer = new offerDB({

                            offerName: name,
                            offerType: offerType,
                            discountPercentage: percentage,
                            discription: discription,
                            expiryDate: expiryDate,
                            categoryID: offerItem,
                            offerItems: applicableItems

                        });

                        const saveOffer = await newOffer.save();
    
                        //UPDATE OFFER IN PRODUCT DB
                        await categoryDB.findByIdAndUpdate(offerItem,
                                        {$set:{offer:saveOffer._id}});

                        const productId = await productDB.findOne({category:offerItem}).select('_id')
                        

                        //UPDATE IN VARIANT FIELD
                        await variantDB.updateMany({productID:productId},
                                {$set: {offerDiscount:percentage}
                                },{upsert:true});


                        return res.status(200).json({success: 'Offer added successfully'});       

                    }

                }else{
                    return res.status(404).json({error: 'Validation failed'});
                }

            //ERROR    
            }else{
                return res.status(404).json({error: 'Validation failed'});
            }


            
        } catch (error) {
            next(error)
        }
    }

// BLOCK OFFERS
         const blockOffer = async (req,res,next) =>{
            try {

                const{offerID}= req.body

                //OFFER ID VALID OR NOT 
                const authChek = await offerDB.findById(offerID).select('_id')

                if (authChek) {

                    //UPDATE FIELD
                    await offerDB.findByIdAndUpdate(offerID,
                                    {$set:{block:true}});

                    return res.status(200).json({success: 'Offer deactivated successfully'});
                    
                }else{
                    return res.status(404).json({error: 'Validation failed'});
                }

            } catch (error) {
                next(error)
            }
         }


// UNBLOCK OFFERS
         const unblockOffer = async (req,res,next) =>{
            try {

                const{offerID}= req.body

                //OFFER ID VALID OR NOT 
                const authChek = await offerDB.findById(offerID).select('_id')

                if (authChek) {

                    //UPDATE FIELD
                    await offerDB.findByIdAndUpdate(offerID,
                                    {$set:{block:false}});

                    return res.status(200).json({success: 'Offer activated successfully'});
                    
                }else{
                    return res.status(404).json({error: 'Validation failed'});
                }

            } catch (error) {
                next(error)
            }
         }






    module.exports = {
        loadOfferPage,
        loadAddOffer,
        insertOffer,
        blockOffer,
        unblockOffer

    }