const Address = require("../models/adressSchema")

async function addAddress(req, res) {
    try {
        const { location, city, pincode, state, country } = req.body;

        const existing_address = await Address.findOne({
            user_id:req.user._id,
            location,
            city,
            pincode,
            state,
            country: country || "India"
        });

        if (existing_address) {
            return res.status(400).json({
                status: "Failed",
                message: "This address already exists."
            });
        }

        const address = { user_id:req.user_id,location, city, pincode, state, country: country || "India" };
        const data = await Address.create(address);

        return res.status(201).json({
            status: "Success",
            message: "Address added successfully!",
            data: data
        });

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}


async function getAddressOfUser(req, res) {
    try {
        const data = await Address.findOne({user_id:req.user_id}).populate({
            path: "user_id",
            select: "name"
        })
        return res.status(200).json({
            status: "Success",
            message: "Here is your address",
            data: data
        })

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}

async function updateAddressOfUser(req,res){
    try{
        const { id } = req.params
        const address = await Address.findOne({_id:id})
        if(!address){
            return res.status(404).json({
                status:"Failed",
                message:"Address not found!"
            })
        }
        const { location, city, pincode, state, country } = req.body;
        const updated_address  = await Address.updateOne({_id:id},{
            $set :{location,city,pincode,state,country}
        })
        return res.status(201).json({
            status:"Success",
            message:"Address updated successfully",
            data:updated_address
        })
    }catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}

async function deleteAddressOfUser(req,res) {
    try{
        const { id } =  req.params
         const address = await Address.findOne({_id:id})
        if(!address){
            return res.status(404).json({
                status:"Failed",
                message:"Address not found!"
            })
        }
        const delete_address = await Address.deleteOne({_id:id})
        return res.status(200).json({
            status:"success",
            message:"Address deleted successfully"
        })
    }catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }  
}


module.exports = { addAddress, getAddressOfUser,updateAddressOfUser,deleteAddressOfUser }