
const express    = require  ('express');
const session    = require  ('express-session');
const flash      = require  ('express-flash');
const app        = express  ();
const nocache    = require  ('nocache')
const userRoute  = require  ('./routes/userRoute');
const adminRoute = require  ('./routes/adminRoute')
const mongoose   = require  ('mongoose');
const username   = require  ('./middleware/username')
require('dotenv').config();


app.set('view engine','ejs');
app.set('views','./view');

//MIDDLEWARE
app.use (nocache());
app.use (express.static('public'));
app.use (express.static('public/adminAssets'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true,secure: false,sameSite: 'strict'}

}));

app.use(username)
app.use(flash());
app.use ('/',userRoute);
app.use ('/admin',adminRoute)



const port = process.env.PORT || 3000 ;

//TO REDIRECT TO UNDEFINED 404 FOR UNDEFINED URLS
app.all('*',(req,res) => {
    res.status(404).render('admin/505')

})


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