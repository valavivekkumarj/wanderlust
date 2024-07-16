const reviews=require('../models/db/reviewsModel');
const listingModel=require('../models/db/listingModel');

//create review post method
module.exports.createNewReviewPost=async(req,res)=>{
    let {id}=req.params;
    const review=req.body.review;
    review.author=req.user._id;
    let listing=await listingModel.findById(id);
    let newReview=new reviews(review);
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success','review created successfully!');
    res.redirect(`/listings/${id}`);
    };

//deleteReviewSingle to delete listining reviews: single reviews
module.exports.deleteReviewSingle=async(req,res)=>{
    let {id,rid}=req.params;
    
        await reviews.findByIdAndDelete(rid);
    await listingModel.findByIdAndUpdate(id,{$pull:{reviews:rid}});
    req.flash('success','review deleted successfully!');
    res.redirect(`/listings/${id}`);
    
    };
