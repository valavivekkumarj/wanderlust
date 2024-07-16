const mongoose=require('mongoose');
const main=require('./connection.js');
  //for post mongoose moddleware
//revires model:
const reviews=require('./reviewsModel.js');
const userModel=require('./userModel.js');
main();

const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true,
        default:'title is not available',
        set:(val)=>val==""?'title is not available':val
    },description:{
        type:String,
        require:true,
        default:'description is not available',
        set:(val)=>val==""?'description is not available':val
    },image:{
        filename:{
            type:String,
            
            default:"image file name"
        },
        url:{
        type:String,
        require:true,
        default:"https://images.unsplash.com/photo-1470043201067-764120126eb4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(val)=>val==""?"https://images.unsplash.com/photo-1470043201067-764120126eb4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":val
        }
    },price:{
        type:Number,
        require:true,
        default:0,
        set:(val)=>val==""?0:val
        
    },location:{
        type:String,
        require:true,
        default:'no location available',
        set:(val)=>val==""?'no location available':val
    },country:{
        type:String,
        require:true,
        default:'country not available',
        set:(val)=>val==""?'country not available':val
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:reviews
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userModel
    }
    ,category:{
        type:String,
        enum:['rooms','iconic cities','mountain','castle','swimming','farmhouse','camping','lake']
    }
    });
    
    listingSchema.post('findOneAndDelete',async(listing)=>{
if(listing){
    await reviews.deleteMany({_id:{$in:listing.reviews}});
}
    });

    //model create
    const listingmodel=new mongoose.model('alllisting',listingSchema);

    module.exports=listingmodel