const isLogin = async(req,res,next) => {
        try {
            if(!req.session.login_id) {
                return res.redirect('/login')
            }
            next();

        } catch (error) {
            console.log(error.message)
        }
}

const isLogout = async(req,res,next) => {
        try {
            if(req.session.login_id){
            return res.redirect('/');
            }
            next();
            
        } catch (error) {
            console.log(error.message);
        }
}




module.exports = {
    isLogin,
    isLogout
}