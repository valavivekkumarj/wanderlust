const express=require('express');
const router=express.Router({mergeParams:true});
const userModel=require('../../models/db/userModel.js');
const customError=require('../../utils/customErrors.js')
const passport=require('passport');
const localStrategy=require('passport-local');
//wrapAsync fun for handle error middleware in app route without use of try catch block
const wrapAsync=require('../../utils/wrapAsync.js');
const { Passport } = require('passport');
const mymiddlewares=require('../../models/auth-models/middleware.js');

//required user controller:
const userControllers=require('../../controllers/usersController.js');

//user signup post method route:
router.post('/signup',wrapAsync(userControllers.userSignupPost));

//user signup form get method  form show route
router.get('/signup',wrapAsync(userControllers.userSignupForm));


//user login form get:
router.get('/login',wrapAsync(userControllers.userLoginForm));

//user login post method verify user:
router.post('/login',mymiddlewares.urlAfterLogin,passport.authenticate('local',{ failureRedirect:'/user/login',failureFlash:true }),wrapAsync(userControllers.userLoginPost));


//logout route:
router.get('/logout',userControllers.userLogout);
module.exports=router