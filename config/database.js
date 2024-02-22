const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = ()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(()=>console.log("Database Connection Successful"))
    .catch((error)=>{
        console.log("Error While Connecting To Database ");
        console.log(error.message);
        process.exit(1);
    })
}
module.exports=dbConnect;