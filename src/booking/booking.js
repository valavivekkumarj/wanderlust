const express=require('express');

const router=express.Router({mergeParams:true});

//dependncies:
const wrapAsync=require('../../utils/wrapAsync');
const customErrors=require('../../utils/customErrors.js');
const mymiddlewares=require('../../models/auth-models/middleware.js');

const path=require('path');
const listingModel=require('../../models/db/listingModel');
const userModel=require('../../models/db/userModel');
const bookingModel=require('../../models/db/bookingModel');

router.route('/:did').get(mymiddlewares.isAuthenticatedUser,wrapAsync(async(req,res)=>{
let {did}=req.params;
let data=await listingModel.findById(did);
res.render('listings/booking.ejs',{title:'boking',data:data});

}));

router.route('/:did').post(mymiddlewares.isAuthenticatedUser,wrapAsync(async(req,res)=>{
    let {did}=req.params;

     let data=req.body.booking;
     let newbooking=new bookingModel({
        checkin:data.checkin,
        checkout:data.checkout,
        destination:did,
        customer:req.user._id
     });
     let newbookingsuccess=await newbooking.save();
     if(newbookingsuccess){
        req.flash('success','congratulations, your booking confirmed!');
        res.redirect('/listings');
     }
    // res.redirect('listings/booking.ejs',{title:'show boking',data:data});
    
    }));



    //show booking card page:
router.route('').get(mymiddlewares.isAuthenticatedUser,wrapAsync(async(req,res)=>{
   let currUserId=req.user._id;

   let data=await bookingModel.findOne({customer:currUserId}).populate('customer').populate('destination');
   if(!data){
      req.flash('error','you dont have any current booked destination.');
      return res.redirect('/listings');
   }
   res.render('listings/showBooking.ejs',{title:'your booking',data:data});
}));


//delete current booking delete all booking of this user:
router.route('/:bid').delete(mymiddlewares.isAuthenticatedUser,wrapAsync(async(req,res)=>{
let {bid}=req.params;
let bookingdata=await bookingModel.findById(bid);
if(req.user._id && !req.user._id.equals(bookingModel.customer)){
   req.flash('error','access denied! unethical behavior notised.');

}
let data=await bookingModel.findOneAndDelete({_id:bid});
req.flash('success','booking canceled successfully!');
res.redirect('/booking');


}));
module.exports=router