const wishlistDB = require('../../model/wishlistModel')

//ADD TO WISHLIST FUNCTION

const addWishlist=async (req,res,next) => {
    try {

        const userID=req.session.login_id;
        const {variantid}=req.body
        const options={upsert: true,new: true}

        const isExisting=await wishlistDB.findOne({userId: userID,variantId: variantid}).select('variantId')
        if(isExisting) {
            return res.status(400).json({error: 'Product already exist '})

        } else {
            await wishlistDB.findOneAndUpdate({userId: userID},
                {$push: {variantId: variantid}},options);
            return res.status(200).json({success: 'Added to Wishlist'})
        }


    } catch(error) {
        next(error)

    }
}

//REMOVE FROM WISHLIST

const removeWishlistItem=async (req,res,next) => {
    try {
        const userID=req.session.login_id;
        const {variantId}=req.body
        const authCheck=await wishlistDB.findOne({userId: userID,variantId: variantId}).select('variantId')
        if(authCheck) {
            await wishlistDB.findOneAndUpdate({userId: userID},
                {$pull: {variantId: variantId}},
                {new: true});

            return res.status(200).json({success: 'Product removed successfully'})

        } else {
            return res.status(400).json({error: 'Invalid operation'})
        }

    } catch(error) {
        next(error)
    }
}



module.exports = {
    addWishlist,
    removeWishlistItem

}