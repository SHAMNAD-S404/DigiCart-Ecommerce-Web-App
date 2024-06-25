

function username(req,res,next) {
    res.locals.username=req.session.username||'null'; 
    next();
}

module.exports=username;