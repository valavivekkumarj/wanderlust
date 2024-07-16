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
const { title, send } = require('process');
const morgan = require('morgan');
//validation schema from validation> schemavalidate.js:
const {validateSchema,validateReview}=require('../../validations/schemaValidate.js');
//=========================================================================================================
//get the callback from the controllers/listingscontroller.js
const listingControllers=require('../../controllers/listingsController.js');
//routes:
const router=express.Router({mergeParams:true});

//required multer for get input image from user for muktipart/data:
const {cloudnary,storage}=require('../cloudConfig.js');
const multer=require('multer');
const upload=multer({storage});


//get the all listings: show all listings
router.route('/').get(wrapAsync(listingControllers.showAllListings));
    
//add new listring in wanderlust:  newlistingsForm get route
router.route('/new').get(mymiddlewares.isAuthenticatedUser,wrapAsync(listingControllers.addNewListingForm));
     
//post method for add new listring in wanderlust:
router.route('/new').post(mymiddlewares.isAuthenticatedUser,upload.single('formdata[image]'),mymiddlewares.validateSchemaMiddleware,mymiddlewares.errorhandler,wrapAsync(listingControllers.addNewListingPost));


//update the details of listing get:
//here we not use validate schema remember it:
router.route('/:id/edit').get(mymiddlewares.isAuthenticatedUser,mymiddlewares.isRightUserToEdit,wrapAsync(listingControllers.updateListingFormGet));

//update listing data put method:
router.put('/:id/edit',mymiddlewares.isAuthenticatedUser,mymiddlewares.isRightUserToEdit,upload.single('formdata[image]'),wrapAsync(listingControllers.updateListingPut));


        //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
//delete single listing :
router.delete('/:id/delete',mymiddlewares.isAuthenticatedUser,mymiddlewares.isRightUserToEdit,wrapAsync(listingControllers.deleteSingleListingBtn));
    
    
//for single listing views:  we keep this route last so other route can extecuted and id in path not create problem
router.get('/:id',wrapAsync(listingControllers.showSingleListing));



















//for search and filter specific listing based on its categories:
router.route('/search').post(wrapAsync(async(req,res)=>{
        let filter=req.body.search;
        arr=['rooms','iconic cities','mountain','castle','swimming','farmhouse','camping','lake'];
        if(arr.includes(filter)){
                let data=await listingModel.find({category:filter});
                res.render('listings/alllistings.ejs',{title:'wanderlust',data:data});
        }else{
                req.flash('error','sorry! could not able to find for this category.');
                res.redirect('/listings');
        }
       
}));
//====================================================================

router.route('/search/:filter').get(wrapAsync(async(req,res)=>{
        let {filter}=req.params;
        arr=['rooms','iconic cities','mountain','castle','swimming','farmhouse','camping','lake'];
        if(arr.includes(filter)){
                let data=await listingModel.find({category:filter});
                res.render('listings/alllistings.ejs',{title:'wanderlust',data:data});
        }else{
                req.flash('error','sorry! could not able to find for this category.');
                res.redirect('/listings');
        }
       
}));
















//export router for app.
    module.exports=router
