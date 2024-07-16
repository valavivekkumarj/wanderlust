const mongoose=require('mongoose');
const listingModel=require('./listingModel');
let {sampleData}=require('./sampleData.js');
const addSampleData=async()=>{
    try{
        sampleData=sampleData.map((ele)=>({...ele,owner:'6690fc5c0df6fa940205439f'}));
        //first we delete all data from collections:
        await listingModel.deleteMany({});
await listingModel.insertMany(sampleData);
let data=await listingModel.find();
let d=await listingModel.find().count();
console.log(data,d);
    }catch(err){
console.log(err);
    }
}
addSampleData();