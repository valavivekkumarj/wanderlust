//require custom error:
// const customError=require('./customError.js');

// const mymiddle=async(req,res,next)=>{
// let {query}=req.query;
// console.log(query);
// console.log('hiiiii');
// next();
// }
// const mymiddle1=async(req,res,next)=>{
//     let {query}=req.query;
//     console.log(query);
//     console.log('middleware 2');
//     next();
//     }
    
//     const logger=async(req,res,next)=>{
//         req.time=new Date(Date.now()).toString();
//         console.log('middleware 2');
//         console.log(req.time,req.path,req.hostname,req.method,req.baseUrl);
//         next();
//         }


// //middle ware function using wrapasync method without try catch block:
// function wrapasync(fn){
//     return function(req,res,next){
//         fn(req,res,next).catch((err)=>next(err));
          
//     }
// }
// const auth=wrapasync(async(req,res,next)=>{
//    const a=6;
//    a=8;

// });

// //middleware using try and catch for checking error conditions:
// const auth1=async(req,res,next)=>{
//     try{
//         abcd==dcba
// next();
//     }catch(err){
//         next(err);
//     }
//  };




// //error handler middleware custom
// const errhandler2=async(err,req,res,next)=>{
    
//     console.log('something wrong happen in request.');
//     res.send('something went wrong.');
//     next();
// }
// //error handler for typerror :
// const typeerrorhandler=async(err,req,res,next)=>{
// if(err.name=='TypeError'){
//      err=validatetypeerror(err);

// }
// next(err);
// };
// //validatetypeerror function 
// function validatetypeerror(err){
//     console.log(err.name);
//     console.log('thsi is validation err');
//     return err;
// }

// const errhandler=async(err,req,res,next)=>{
//     let {status=500,message}=err;
//     console.log(status,err.message);
//     res.status(status).send(message);
//     next();
//     }
   


//middleware for validating the schema input values in database
const path=require('path');

const {validateSchema,validateReview}=require(path.join(__dirname,'../../validations/schemaValidate.js'));
const customError=require(path.join(__dirname,'../../utils/customErrors.js'));
const listingModel=require('../db/listingModel');
const reviews=require('../db/reviewsModel');



const validateSchemaMiddleware=async(req,res,next)=>{
let formdata=req.body.formdata;
let {error,value}=validateSchema.validate({formdata});
if(error){
    let errmsg=error.details.map((ele)=>ele.message).join(',');
   
    next(new customError(400,errmsg));
}
else{
    next();
}
};
//==================================================================================================
//middleware to validate Reviews schema:
const validateReviewMiddleware=async(req,res,next)=>{
const review=req.body.review;
let {error,value}=validateReview.validate({review});
if(error){
    let errmsg=error.details.map((ele)=>ele.message).join(',');
    next(new customError(400,errmsg));
}else{
    next();
}
};

//middleware to authenticate user to check user is authorised or not to access this page:
const isAuthenticatedUser=async(req,res,next)=>{
    if(!req.isAuthenticated()){
        //console.log(req.originalUrl);
        req.session.redirectUrl=req.originalUrl;
        req.flash('error','Sorry!  You must be logged in to perform this action');
        res.redirect('/user/login');
                }
                else{
                    next();
                }
}
//middleware to strore redirectUrl into res.locals:
const urlAfterLogin=async(req,res,next)=>{
    if(req.session.redirectUrl){
res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


//middleware to check right user try to edit or delete listings:
const isRightUserToEdit=async(req,res,next)=>{
    try{
let id=req.params.id;
let listing=await listingModel.findById(id).populate('owner');
if (req.user && req.user.equals(listing.owner)){
    next();
}else{
     req.flash('error','This listings doesn`t belongs to you.');
     return res.redirect(`/listings/${id}`);
}
    }catch(err){
        next(err);
    }
};

//middleware to check is it right user to delete reviews check is this author of this review
const isAuthorReview=async(req,res,next)=>{
    try{
        let {id,rid}=req.params;
        let currReview=await reviews.findById(rid).populate('author');
        if(req.user && req.user._id.equals(currReview.author._id)){
            next();
        }
        else{
            req.flash('error','you can only remove your reviews!');
            return res.redirect(`/listings/${id}`);
            }
    }catch(err){
        next(err);
    }
}

 //error handler for all route:
 
 const errorhandler=async(err,req,res,next)=>{
    let {statusCode=500,message}=err;
    console.log(message);
    res.status(statusCode).render('listings/erroralertspage.ejs',{title:'Error',err:err});
};
    
module.exports={validateSchemaMiddleware,errorhandler,validateReviewMiddleware,isAuthenticatedUser,urlAfterLogin,isRightUserToEdit,isAuthorReview};