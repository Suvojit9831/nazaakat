const User = require('../models/User');
const OTP=require('../models/OTP')
const bcrypt = require('bcryptjs');
const otpGenerator= require('otp-generator')
const validator = require('validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sendotp = async (req, res) => {
    try {
        const { email } = req.body

        // Check if user is already present
        // Find user with provided email
        const checkUserPresent = await User.findOne({ email })
        // to be used in case of signup

        // If user found with provided email
        if (checkUserPresent) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `User is Already Registered`,
            })
        }

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,

        })
        const result = await OTP.findOne({ otp: otp })
        // console.log("Result is Generate OTP Func")
        console.log("OTP", otp)
        console.log("Result", result)
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            })
        }
        const otpPayload = { email, otp }
        const otpBody = await OTP.create(otpPayload)
        console.log("OTP Body", otpBody)
        res.status(200).json({
            success: true,
            message: `OTP Sent Successfully`,
            otp,
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ success: false, error: error.message })
    }
}
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, phoneNo, status, otp } = req.body;
        if (!name || !email || !password || !phoneNo || !otp) {
            return res.status(401).json({
                success: false,
                message: "Please Fill all the Entry"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(401).json({
                success: false,
                message: "Please Enter a valid Email"
            })
        }
        if (name.trim().length < 4  || name.trim().length >30) {
            return res.status(401).json({
                success: false,
                message: "Name is too short"
            })
        }
        if (password.length < 8) {
            return res.status(401).json({
                success: false,
                message: "Password should be greater than 8 characters"
            })
        }
        if (status) {
            return res.status(401).json({
                success: false,
                message: "User is not allowed to set status"
            })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already Registered"
            })
        }
        // Find the most recent OTP for the email
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log(response)
        if (response.length === 0) {
            // OTP not found for the email
            return res.status(400).json({
                success: false,
                message: "OTP expired",
            })
        } else if (otp !== response[0].otp) {
            // Invalid OTP
            return res.status(400).json({
                success: false,
                message: "The OTP is not valid",
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userImage = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${name}`;
        const userDetails = await User.create({
            name, email, password: hashedPassword, phoneNo, userImage, role: "USER"
        })
        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            data: userDetails

        })

    } catch (error) {
        console.log("error while creating account --------- ", error.message);
        res.status(500).json({
            success: false,
            message: "Something wrong happend... try again!"
        })
    }

}

exports.login = async (req, res) => {
    try {
        //fetching details
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: "Please Fill all the Entry"
            })
        }
        //is  user registered?
        let existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is not Registered... SignUp first! "
            })
        }

        //payload 
        const payload = {
            _id: existingUser._id,
            role: existingUser.role,
            status: existingUser.status,
            name: existingUser.name,
            email: existingUser.email
        }

        //verify and generate jwt token

        if (await bcrypt.compare(password, existingUser.password)) {
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2d"
            })
            existingUser = existingUser.toObject();
            existingUser.token = token;
            existingUser.password = null;
            // cookie(name,data,options)
            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //default time 20min
                httpOnly: true, //client side e access jate na korte pare
            }
            res.cookie("token", token, option).status(200).json({
                success: true,
                token,
                user: existingUser,
                message: `You are successfully logged in `,
            })

        } else {
            //password do not match
            return res.status(403).json({
                success: false,
                message: 'Please Enter Correct Password'
            })
        }


    } catch (error) {
        console.log("Error while trying to login--------", error.message)
        res.status(500).json({
            success: false,
            message: "Something wrong happend... try again!"
        })
    }
}