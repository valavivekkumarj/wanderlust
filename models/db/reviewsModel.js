const { required } = require('joi');
const mongoose=require('mongoose');
const userModel=require('./userModel');
//reviews schema:
const reviewSchema=new mongoose.Schema({
comments:{
    type:String,
    required:true,
    default:"no comments",
    set:(val)=>val==""?"no comments":val
},
ratings:{
    type:Number,
    min:1,
    max:5,
    default:1,
    required:true,
    set:(val)=>val==null?1:val
},
created_at:{
    type:Date,
    default:Date.now()
},
author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:userModel
}
});

const reviews=new mongoose.model('Review',reviewSchema);

module.exports=reviews