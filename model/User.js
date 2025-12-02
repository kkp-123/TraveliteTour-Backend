const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// define the person schema

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    
    usertype:{
        type : String,
        enum: ['user','admin'],
        default: 'user'

    },
    mobile : {
        type : String,
        required : true
    },
    email : {
        type: String,
        required : true,
        unique : true
    },
   
    username : {
        type : String,
        required : true,
        unique: true
    },
    password : {
        type : String,
        required : true
    },
    createdAt: {
        type:Date,
        default:Date.now()
    }
    
});

userSchema.pre('save', async function(next){
    const rg = this;
    if(!rg.isModified('password')) return next();

    try{
        const salt = await bcrypt.genSalt(10);

        const hashpassowrd = await bcrypt.hash(rg.password,salt)

        rg.password = hashpassowrd;
        next();
    }
    catch(err)
    {
        return next(err);
    }
})
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // If password is NOT being updated → skip
  if (!update.password && !update.$set?.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);

    // where password could be in $set or direct
    const plainPassword =
      update.password || update.$set.password;

    const hashed = await bcrypt.hash(plainPassword, salt);

    if (update.password) {
      update.password = hashed;           // direct update
    } else {
      update.$set.password = hashed;      // $set update
    }

    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function(pass){

    try{
        return await bcrypt.compare(pass,this.password)
    }
    catch(err)
    {
        throw err;
    }

}

const User = mongoose.model('User',userSchema);
module.exports = User;