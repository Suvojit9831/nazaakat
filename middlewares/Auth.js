// auth , isAdmin , isUser
const jwt=require('jsonwebtoken')
require('dotenv').config();

exports.auth=(req,res,next)=>{
    try {
        //extract JWT token
        const token= req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");

        if(!token || token===undefined){
            return res.status(401).json({
                status:false,
                message:'Please login Again'
            });
        }

        //verify the token
        try {
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            req.user=payload;

        } catch (error) {
             return res.status(401).json({
                status:false,
                message:'token is invalid'
            });
        }
        next();

    } catch (error) {
        return res.status(401).json({
            status:false,
            message:'Something went wrong'
        });
    }
}

exports.isAdmin=(req,res,next)=>{
    try {
        if(req.user.role !== "ADMIN" || req.user.status !== "Approved" ){
            return res.status(401).json({
                status:false,
                message:'This is a Protected Route for Admin'
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            status:false,
            message:'Internal server error'
        });
    }
}

exports.isUser=(req,res,next)=>{
    try {
        if(req.user.role === "USER" || req.user.role==="ADMIN" ){
            next();   
        }else{
            return res.status(401).json({
                status:false,
                message:'User is not logged in'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status:false,
            message:'Internal server error'
        });
    }
}