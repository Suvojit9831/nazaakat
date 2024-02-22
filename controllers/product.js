const Product = require('../models/Product')
const mailSender = require('../utils/sendMail');
const { productCreatedTemplate } = require('../mail/productCreatedTemplate');

exports.addProduct = async (req, res) => {
    try {
        //fetching from body 
        const { title, description, price, mrp, imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, category, stock } = req.body;
        if (!title || !description || !price || !mrp || !imageUrl1 || !category || !stock) {
            return res.status(400).json({
                success: false,
                message: "Fill all the Input"
            })
        }
        // insert all 5 images into   imageUrl array
        let imageUrl = [];
        if(imageUrl1){
            imageUrl.push(imageUrl1)
        }
        if(imageUrl2){
            imageUrl.push(imageUrl2)
        }
        if(imageUrl3){
            imageUrl.push(imageUrl3)
        }
        if(imageUrl4){
            imageUrl.push(imageUrl4)
        }
        if(imageUrl5){
            imageUrl.push(imageUrl5)
        }


        // MRP - MRP *offer = price  
        //  offer = (MRP - price)  / MRP) *100
        const offer = Math.floor(((mrp - price) / mrp) * 100)

        const productDetails = await Product.create({ title, description, price, mrp, imageUrl, category, stock, offer })
        if (!productDetails) {
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            })
        }
        try {
            const mailResponce = mailSender(req.user.email, "Product Added Successfully", productCreatedTemplate(req.user.name, productDetails.title, imageUrl[0]))
        } catch (error) {
            console.log("Error while sending mail")
            console.log("Error message :", error.message)
            return res.json({
                success: false,
                message: "Something went wrong...",
            })
        }
        res.status(200).json({
            success: true,
            message: `Product Created Successfully with id : ${productDetails._id}`,
            data: productDetails
        })
    } catch (error) {
        console.log("Error while creating product : ----- ", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong.....  please try again!"
        })
    }

}



exports.updateProduct = async (req, res) => {
    try {
        //fetching from body 
        const { title, description, price, mrp, imageUrl1, imageUrl2, imageUrl3, imageUrl4, imageUrl5, category, stock } = req.body;
        if (!title || !description || !price || !mrp || !imageUrl1 || !category || !stock) {
            return res.status(400).json({
                success: false,
                message: "Fill all the Input"
            })
        }
        const imageUrl = [];
        for (i = 1; i < 6; i++) {
            if (imageUrl`${i}`) {
                imageUrl.push(imageUrl`${i}`)
            }
        }
        const productId = req.params.id
        let offer = 0;

        offer = Math.floor(((mrp - price) / mrp) * 100)

        const productDetails = await Product.findOneAndUpdate({ _id: productId }, {
            offer, title, description, imageUrl, category, stock,price,mrp
        }, { new: true })
        if (!productDetails) {
            return res.status(500).json({
                success: false,
                message: `Product Not Found With ID : ${_id}`
            })
        }
        res.status(200).json({
            success: true,
            message: `Product Update Successfully with id : ${productDetails._id}`,
            data: productDetails
        })
    } catch (error) {
        console.log("Error while updating product : ----- ", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong.....  please try again!"
        })
    }

}


exports.getAllProduct = async (req, res) => {
    try {
        const productDetails = await Product.find({})
        if (!productDetails) {
            return res.status(500).json({
                success: false,
                message: "No Product Found"
            })
        }
        res.status(200).json({
            success: true,
            data: productDetails
        })
    } catch (error) {
        console.log("Error while getAllProduct product : ----- ", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong.....  please try again!"
        })
    }

}

exports.getProductById = async (req, res) => {
    try {
        const _id = req.params.id
        const productDetails = await Product.findOne({ _id }).populate({
            path: 'reviews',
            populate: { path: 'user' }
        }).exec();
        if (!productDetails) {
            return res.status(500).json({
                success: false,
                message: `Product Not Found With ID : ${_id}`
            })
        }
        res.status(200).json({
            success: true,
            data: productDetails
        })
    } catch (error) {
        console.log("Error while getProductById product : ----- ", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong.....  please try again!"
        })
    }

}


exports.deleteProduct = async (req, res) => {
    try {
        const _id = req.params.id
        const productDetails = await Product.findOneAndDelete({ _id })
        if (!productDetails) {
            return res.status(500).json({
                success: false,
                message: `Product Not Found With ID : ${_id}`
            })
        }
        res.status(200).json({
            success: true,
            message: `Product with ID : ${productDetails._id}  deleted successfully`
        })
    } catch (error) {
        console.log("Error while Deleting product : ----- ", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong.....  please try again!"
        })
    }

}