const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    review:{
        type:String,
        required:true,
        // maxLength:[50, "Review cannot exceed 50 characters"],
        minLength: [4, "Review should have more than 4 characters"],
    },
    rating:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true,
    }
})

module.exports= mongoose.model("Review",reviewSchema)