const express = require("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const userRoutes =require("./routes/userRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const charityRoutes = require("./routes/charityRoutes")
const productRoutes = require("./routes/productRoutes")
const addressRoutes = require("./routes/addressRoutes")

const mongo_url= process.env.MONGO_URL
const port= process.env.PORT || 8080

app.use(express.json())

function connectToMDB(){
    try{
        mongoose.connect(mongo_url);
        console.log("Connected to DB");
        
    }catch(err){
        console.log("Error in connecting mongo db",err.message);
        
    }
}

app.use("/api/v1/users",userRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/charity",charityRoutes)
app.use("/api/v1/product",productRoutes)
app.use("/api/v1/address",addressRoutes)

app.listen(port,()=>{
    connectToMDB()
    console.log(`Server is running on ${port} port`);  
     
})
