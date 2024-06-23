
const express    = require  ('express');
const session    = require  ('express-session');
const flash      = require  ('express-flash');
const app        = express  ();
const nocache    = require  ('nocache')
const userRoute  = require  ('./routes/userRoute');
const adminRoute = require  ('./routes/adminRoute')
const mongoose   = require  ('mongoose');
require('dotenv').config();


app.set('view engine','ejs');
app.set('views','./views');

//MIDDLEWARE
app.use (nocache());
app.use (express.static('public'));
app.use (express.static('public/adminAssets'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true,secure: false,sameSite: 'strict'}

}))


app.use(flash());
app.use ('/',userRoute);
app.use ('/admin',adminRoute)



const port = process.env.PORT || 3000 ;


app.use((req,res,next) => {
    const err=new Error('Not Found');
    err.status=404;
    next(err);
});

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('connection with database established........');
})
    .catch((error) => {
        console.log(error.message);
})


app.listen(port,() =>{
    console.log(`server is running on port http://localhost:${port}`)
})