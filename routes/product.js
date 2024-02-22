const express= require('express');
const { isAdmin, isUser, auth } = require('../middlewares/Auth');
const { addProduct, getAllProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/product');
const router = express.Router();


router.post('/create',auth,isAdmin,addProduct);
router.get('/getallproduct',getAllProduct);
router.get('/getproduct/:id',getProductById);
router.put('/update/:id',auth,isAdmin,updateProduct);
router.delete('/delete/:id',auth,isAdmin,deleteProduct);

module.exports = router