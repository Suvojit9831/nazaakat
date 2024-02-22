const Product = require('../models/Product');
const Review = require('../models/Review');

exports.createReview = async (req, res) => {
    try {
        const userId = req.params.userid;
        const productId = req.params.productid;
        const review = req.body.review;
        const rating = parseInt(req.body.rating);

    
        if (rating > 5 || rating < 0) {
            return res.status(400).json({
                success: false,
                message: `Rate the product between 0-5`
            })
        }
        if (review.length < 1) {
            return res.status(400).json({
                success: false,
                message: `Review should have more than 1 characters`
            })
        }
        const productDetails = await Product.findOne({ _id: productId })
        if (!productDetails) {
            return res.status(400).json({
                success: false,
                message: `Product With this ID : ${productId} not found `
            })
        }
        const reviewDetails = await Review.create({ review,rating, user: userId, product: productId })
        const productDetails1 = await Product.findOneAndUpdate({ _id: productId }, { $push: { reviews: reviewDetails._id } }, { new: true })
        res.status(200).json({
            success: true,
            message: "Review Created ",
            data: productDetails1
        })
    } catch (error) {
        console.log("Error while creating review :     ", error.message)
        res.status(400).json({
            success: false,
            message: `Something Went Wrong`
        })
    }


}


exports.deleteReview = async (req, res) => {
    try {

        const productId = req.params.productid;
        const reviewId = req.params.reviewid;
        const productDetails = await Product.findOne({ _id: productId })
        if (!productDetails) {
            return res.status(400).json({
                success: false,
                message: `Product With this ID : ${productId} not found `
            })
        }
        await Review.findOneAndDelete({ _id: reviewId });
        const newProductDetails = await Product.findOneAndUpdate({ _id: productId }, { $pull: { reviews: reviewId } }, { new: true })
        res.status(200).json({
            success: true,
            data: newProductDetails
        })
    } catch (error) {
        console.log("Error while creating review :     ", error.message)
        res.status(400).json({
            success: false,
            message: `Something Went Wrong`
        })
    }
}