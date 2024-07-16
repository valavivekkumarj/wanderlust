const reviews=require('../models/db/reviewsModel');
const listingModel=require('../models/db/listingModel');
const userModel=require('../models/db/userModel');


//user signup form 
module.exports.userSignupForm=async(req,res)=>{
    res.render('user/signup.ejs',{title:'signup'});
    };

//user signup post method route callback store data into userModel:
module.exports.userSignupPost=async(req,res,next)=>{
    try{
    let {email,username,password}=req.body.formdata;
const newUser=new userModel({
email:email,
username:username
});
let registerUser=await userModel.register(newUser,password);
req.login(registerUser,(err)=>{
    if(err){
        next(err);
    }else{
    req.flash('success','welcome to wanderlust');
    res.redirect('/listings');
    }
});
}
catch(e){
    req.flash('error','user with the given name is already registered!');
    res.redirect('/listings');
}
};


//user login form get method:
module.exports.userLoginForm=async(req,res)=>{
    res.render('user/login.ejs',{title:'login'});
    };

//user login post method:
module.exports.userLoginPost=async(req,res)=>{
    req.flash('success','welcome to wanderlust');
    const redirectUrl=res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
    };

//user logout button 
module.exports.userLogout=async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash('success','logout successfully');
        res.redirect('/listings');
    })
};