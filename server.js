const express= require('express');
require('dotenv').config();
const dbConnect= require('./config/database');
const userRoute= require('./routes/user')
const productRoute= require('./routes/product')
const reviewRoute=require('./routes/review')
const cookieParser= require('cookie-parser');
const cors= require('cors')
const app= express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1',userRoute);
app.use('/api/v1/product',productRoute);
app.use('/api/v1',reviewRoute)
app.use(cors());

dbConnect();

app.get('/',(req,res)=>{
    res.send('hi')
})
app.listen(PORT,()=> console.log(`Server is Running at ${PORT}`))
