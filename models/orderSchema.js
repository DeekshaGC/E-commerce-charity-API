const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    product_id:{
        type:mongoose.Types.ObjectId,
        ref:"Product",
        required:true
    },
    charity_id:{
        type:mongoose.Types.ObjectId,
        ref:"Charity",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
    }
},{timestamps:true})

const Order = mongoose.model("Order",orderSchema)

module.exports = Order