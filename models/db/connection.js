const mongoose=require('mongoose');

const url=process.env.ATLASDB_CONNECT;//connect with local base

const main=async ()=>{
    try{
        await mongoose.connect(url);
        console.log('connect to db succesfully');
    }catch(err){
        console.log(err);
    }
    
    // mongoose.connect(url).then(()=>{
    //     console.log('connect to db succesfully');
    // }).catch((err)=>{
    //     console.log(err);
    // });
    
}

module.exports=main