const express = require('express');
const session = require('express-session');
const flash   = require('express-flash');
const app     = express();
const path    = require('path')
const nocache = require('nocache')
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute')
const mongoose  = require('mongoose');
const {link}=require('fs');
                  require('dotenv').config();


app.use (nocache());
//CSS AND ASSETS file link
app.use (express.static('public'));
app.use (express.static('public/adminAssets'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {httpOnly: true,secure: false,sameSite: 'strict'}

}))

app.use ('/',userRoute);
app.use ('/admin',adminRoute)
app.use(flash());


const port = process.env.PORT || 3000 ;

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