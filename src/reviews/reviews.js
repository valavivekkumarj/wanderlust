const express=require('express');
const path=require('path');
const ejs=require('ejs');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const port=process.env.PORT || 3000;
//require other user-defined modules from wanderlust folder
const main=require('../../models/db/connection.js'); //to make connection with db
const listingModel=require('../../models/db/listingModel.js'); //collection model for alllisting in db
//reviews model:
const reviews=require('../../models/db/reviewsModel.js');//collection model for reviews for each listingd
//my custom middle ware file path: models/auth-models:
//const mymiddle=require(path.join(__dirname,'../models/auth-models/middleware'));
const mymiddlewares=require(path.join(__dirname,'../../models/auth-models/middleware')); //middleware to validate schemas

//custom error file path from utils
const customError=require('../../utils/customErrors.js')
//wrapAsync fun for handle error middleware in app route without use of try catch block
const wrapAsync=require('../../utils/wrapAsync.js');
const { title } = require('process');
const morgan = require('morgan');
//validation schema from validation> schemavalidate.js:
const {validateSchema,validateReview}=require('../../validations/schemaValidate.js');

//=====================================================================================================
//require the reviewController //reviewcontroller form controller:
const reviewContollers=require('../../controllers/reviewsController.js');







const router=express.Router({mergeParams:true});


//route for review create post for listings:
router.post('/',mymiddlewares.isAuthenticatedUser,mymiddlewares.validateReviewMiddleware,wrapAsync(reviewContollers.createNewReviewPost));
    
//delete route to delete listining reviews: single reviews
router.delete('/:rid',mymiddlewares.isAuthenticatedUser,mymiddlewares.isAuthorReview,wrapAsync(reviewContollers.deleteReviewSingle));
    
    module.exports=router