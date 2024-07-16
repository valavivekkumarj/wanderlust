const listingModel=require('../models/db/listingModel');
const customError=require('../utils/customErrors.js');

//showAllListings
module.exports.showAllListings=async(req,res)=>{

    let data=await listingModel.find();
    res.render('listings/alllistings.ejs',{data:data,title:'WANDERLUST'});
    
    };

//addNewListingForm  for get route
module.exports.addNewListingForm=async(req,res)=>{
        //console.log(req.user);
        
        res.render('listings/newlistings.ejs',{title:'new listing'});
        
        };

//addNewListing  for post route
module.exports.addNewListingPost=async(req,res)=>{
let filename=req.file.filename;
let url=req.file.path;
    let formdata=req.body.formdata;  //here we direclty get data in object format
    let newplace=new listingModel({
        title:formdata.title,
        'image.filename':filename,
        'image.url':url,
        description:formdata.description,
        price:formdata.price,
        location:formdata.location,
        country:formdata.country,
        category:formdata.category
    }
    );
    newplace.owner=req.user._id;
    await newplace.save();

    req.flash('success','new listing created!');
    res.redirect('/listings');
    };

//update listing grt form:
module.exports.updateListingFormGet=async(req,res)=>{
       
    let {id}=req.params;
    const data=await listingModel.findOne({_id:id});
    let originalImageUrl=data.image.url;
    originalImageUrl=originalImageUrl.replace('upload','upload/w_250');
    res.render('listings/editlistings.ejs',{data:data,title:'update listing',originalImageUrl:originalImageUrl});
    };


//updateListing put method 
module.exports.updateListingPut=async(req,res)=>{
       
    let {id}=req.params;
    let dataobj=req.body.formdata;
    if(!dataobj){
        throw new customError(400,'send valid data for listing');
    }
   
   let data= await listingModel.findOneAndUpdate({_id:id},{$set:{
        title:dataobj.title,
        
        description:dataobj.description,
        price:dataobj.price,
        location:dataobj.location,
        country:dataobj.country
    }});
    //we we not directly try to store image data incase image is not updated so we got error:
    if(typeof req.file!='undefined'){
        let filename=req.file.filename;
       let url=req.file.path;
       data.image.url=url;
       data.image.filename=filename;
       await data.save();
    }

    if(!data){
        req.flash('error','listing does not exits.');
        res.redirect('/listings');
    }
    req.flash('success','listing updated successfully!');
    res.redirect(`/listings/${id}`);
    };


//delete listing single delete button logic:
module.exports.deleteSingleListingBtn=async(req,res)=>{
   
    let {id}=req.params;
    let listing=await listingModel.findOneAndDelete({_id:id});
    req.flash('success','listing deleted successfully');
    res.redirect('/listings');
       
    };



//show single listing get method route callback: after touch on card:
module.exports.showSingleListing=async(req,res)=>{
        
    let {id}=req.params;

let data=await listingModel.findOne({_id:id}).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
//console.log(data);
if(!data){
    req.flash('error','listing does not exits.');
    res.redirect('/listings');
}else{
res.render('listings/singlelistings.ejs',{data:data,title:'WANDERLUST'});
}
};