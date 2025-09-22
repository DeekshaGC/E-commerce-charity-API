const mongoose = require("mongoose")

const categoryModel = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    image:{
        type:String,
        required:true
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }   
},{timestamps:true}) 

const Category = mongoose.model("Category",categoryModel)

module.exports = Category