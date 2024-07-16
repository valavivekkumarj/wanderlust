if(process.env.NODE_ENV!='production'){
    require('dotenv').config();
}

const express=require('express');
const path=require('path');
const ejs=require('ejs');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const port=process.env.PORT || 3000;
//require other user-defined modules from wanderlust folder
const main=require('../models/db/connection.js'); //to make connection with db
const listingModel=require('../models/db/listingModel.js'); //collection model for alllisting in db
//reviews model:
const reviews=require('../models/db/reviewsModel.js');//collection model for reviews for each listingd
//my custom middle ware file path: models/auth-models:
//const mymiddle=require(path.join(__dirname,'../models/auth-models/middleware'));
const mymiddlewares=require(path.join(__dirname,'../models/auth-models/middleware')); //middleware to validate schemas

//custom error file path from utils
const customError=require('../utils/customErrors.js')
//wrapAsync fun for handle error middleware in app route without use of try catch block
const wrapAsync=require('../utils/wrapAsync.js');
const { title } = require('process');
const morgan = require('morgan');
//validation schema from validation> schemavalidate.js:
const {validateSchema,validateReview}=require('../validations/schemaValidate.js');
//session and flash
const session=require('express-session');
//mongostore for deployment session:
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
//passport package:
const passport=require('passport');
const localStrategy=require('passport-local');
//required useModel:
const userModel=require('../models/db/userModel.js');
//express app
const app=express();
main();
app.use(methodOverride('_method')); //for change the type of http method from client side:
//set the ejs-mate engine with ejs:
app.engine('ejs',ejsMate);
//set the ejs as view engine:
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'../views'));
//use static files:
app.use(express.static(path.join(__dirname,'../public')));
//for parse the url and read data in from of json:
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const url=process.env.ATLASDB_CONNECT;
//for mongostore:
const store = MongoStore.create({
    mongoUrl: url,
    crypto: {
      secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
  });

store.on('error',()=>{
    console.log('error in mongo store:',error);
})
  //use session and flash:
const sessionOptins={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1*24*60*60*1000,
        maxAge:2*24*60*60*1000,
        httpOnly:true
    }
};


app.use(session(sessionOptins));
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new localStrategy(userModel.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


// pre middleware  for res.locals variable
app.use((req,res,next)=>{
    res.locals.msg=req.flash('success');  //for flash success msg
    res.locals.err=req.flash('error');    //for flash errror msg
    res.locals.currUser=req.user;         //for check user is loged in or not:
    next();
});

//get all routes of application
const listingRoute=require('./listings/listings.js');
const reviewRoute=require('./reviews/reviews.js');
const userRoute=require('./users/user.js');
const bookingRoute=require('./booking/booking.js');

app.use('/listings',listingRoute);
app.use('/listings/:id/reviews',reviewRoute);
app.use('/user',userRoute);
app.use('/booking',bookingRoute);



//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  




//midddleware for page not found if page is not valid url then this page was render as response:
app.all('*',wrapAsync(async(req,res)=>{

//res.render('listings/404errorpage.ejs',{title:'404 error'});
throw new customError(404,'this page is not found.');
}
    ));

//error handler middleware fro all routes:
app.use(mymiddlewares.errorhandler);



//listning port 3000
app.listen(port,(err)=>{
if(err){
    console.log(err);
}
else{
    console.log(`runing on port : ${port}`);
}
});
