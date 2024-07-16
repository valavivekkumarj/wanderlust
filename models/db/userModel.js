const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const main=require('./connection');
const { required } = require('joi');

main();
//user schema:
//here passport-local-mongoose package automatically create username and password hashed and salted
//so we no need to create username and password field:

const userSchema=new mongoose.Schema({
email:{
    type:String,
    required:true
}
});
userSchema.plugin(passportLocalMongoose);
const user=new mongoose.model('user',userSchema);

module.exports=user

