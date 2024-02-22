const mongoose = require("mongoose");


const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter product Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  mrp:{
    type: Number,
    required: [true, "Please Enter product MRP"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  offer:{
    type: Number,
    required: true
  },
  imageUrl:[{
    type:String,
    required:true    
  }],
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  reviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Review'
  }],
  createdAt: {
    type: Date,
    default:Date(),
  },
  productRating: {
    type:Number,
    default:0
  }
});

module.exports = mongoose.model("Product", productSchema);
