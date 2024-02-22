const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: [30, "Name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
  },
  phoneNo:{
    type:Number,
    required:true
  },
  userImage: {
    type: String,
    required: true,
    default:"https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Aneka"
  },
  status:{
    type:String,
    enum:["Approved","Not Approved"],
    default:"Not Approved"
  },
  role: {
    type: String,
    enum:["ADMIN","USER","VISITOR"],
    default: "VISITOR",
  },
  createdAt: {
    type: Date,
    default: Date(),
  },
  wishList:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product'
  }]
  
});



module.exports = mongoose.model("User", userSchema);
