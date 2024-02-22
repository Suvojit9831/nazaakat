const express= require('express');
const { signup, login ,sendotp } = require('../controllers/auth');
const { isAdmin, isUser, auth } = require('../middlewares/Auth');
const router = express.Router();


router.post('/signup',signup);
router.post('/login',login);
router.post("/sendotp", sendotp)

router.get('/admin',auth,isAdmin,(req,res)=>{
    res.send("This is Protected Route for Admin")
})
router.get('/user',auth,isUser,(req,res)=>{
    res.send("This is Protected Route for User")
})
module.exports= router;