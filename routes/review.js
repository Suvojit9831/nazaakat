const express= require('express');
const { isAdmin, isUser, auth } = require('../middlewares/Auth');
const { createReview, deleteReview } = require('../controllers/review');
const router = express.Router();


router.post('/user/:userid/product/:productid',auth,isUser,createReview);
router.delete('/product/:productid/:reviewid',auth,isAdmin,deleteReview)

module.exports = router