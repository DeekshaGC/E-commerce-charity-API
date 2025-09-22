const mongoose = require("mongoose")

const adressSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    location :{
        type:String,
        required : true
    },
    city :{
        type:String,
        required: true
    },
    pincode:{
        type: Number,
        required : true
    },
    state :{
        type:String,
        required: true
    },
    country:{
        type: String,
    }
},{timestamps : true})

const Address = mongoose.model("Address",adressSchema)

module.exports = Address