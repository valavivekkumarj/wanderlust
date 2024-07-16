const mongoose=require('mongoose');
const main=require('./connection');
main();
const listingModel=require('./listingModel');
const userModel=require('./userModel.js');
const { required } = require('joi');

const bookingSchema=new mongoose.Schema({
    checkin:{
        type:Date,
        required:true
    },
    checkout:{
        type:Date,
        required:true
    },
    destination:{
        type:mongoose.Schema.Types.ObjectId,
        ref:listingModel
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userModel
    }
});

const bookingModel=mongoose.model('booking',bookingSchema);

module.exports=bookingModel