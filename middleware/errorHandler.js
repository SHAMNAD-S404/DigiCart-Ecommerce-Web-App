
//FOR HANDLING GLOBAL ERRORS

    const errorHandler = (err,req,res,next) => {

        console.error(err);

        res.status(400).render('404',{error:err})
    };

    module.exports = errorHandler