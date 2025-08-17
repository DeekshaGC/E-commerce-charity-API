require("dotenv").config();
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Charity = require("../models/charitySchema");
const Address = require("../models/adressSchema")
const Order = require("../models/orderSchema");


const sender_email = process.env.EMAIL_USER
const email_password = process.env.EMAIL_PASS
const recipient_email = process.env.TEST_RECIPIENT_EMAIL

const twilio_sid = process.env.TWILIO_SID
const auth_token = process.env.TWILIO_AUTH_TOKEN
const twilio_phno = process.env.TWILIO_PHONE_NUMBER
const recipient_phno = process.env.TEST_RECIPIENT_PHONE

const client = new twilio(twilio_sid, auth_token);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: sender_email,
        pass: email_password
    }
});

async function placeOrder(req, res) {
    try {
        const { product_id, charity_id, quantity } = req.body;

        const user = await User.findOne({ _id: req.user_id });
        if (!user) {
            return res.status(401).json({ status: "Failed", message: "User not logged in" });
        }

        const address = await Address.findOne({user_id:user._id})
        if (!address) {
            return res.status(400).json({
                status: "Failed",
                message: "Address details are required to place an order"
            });
        }

        const product = await Product.findOne({ _id: product_id });
        if (!product) {
            return res.status(404).json({ status: "Failed", message: "Product not found" });
        }

        const charity = await Charity.findOne({ _id: charity_id }).populate("user_id");
        if (!charity) {
            return res.status(404).json({
                status: "Failed",
                message: "Charity not found"
            });
        }

        if (product.status !== "active") {
            return res.status(400).json({
                status: "Failed",
                message: "Product must be active"
            });
        }
        if (charity.status !== "live") {
            return res.status(400).json({
                status: "Failed",
                message: "Charity must be live"
            });
        }

        if (quantity > product.quantity) {
            return res.status(400).json({
                status: "Failed",
                message: `Only ${product.quantity} units available`
            });
        }

        const totalAmount = product.price * quantity;
        const order = await Order.create({
            user_id: req.user_id,
            product_id,
            charity_id,
            quantity,
            amount: totalAmount
        });

        product.quantity -= quantity;
        await product.save();

        try {
            await client.messages.create({
                body: `Hi ${user.name}, your order for ${quantity} x ${product.title} is confirmed.`,
                from: twilio_phno,
                to: recipient_phno
            });
        } catch (err) {
            return res.status(500).json({
                status:"Failed",
                message:err.message
            })
        }

        try {
            await transporter.sendMail({
                from: sender_email,
                to: recipient_email,
                subject: "Order Confirmation",
                text: `Hello ${user.name},\n\nYou have successfully ordered ${quantity} x ${product.title}.`
            });
        } catch (err) {
            return res.status(500).json({
                status: "Failed",
                message: err.message
            });
        }

        try {
            await transporter.sendMail({
                from: sender_email,
                to: recipient_email,
                subject: "New Donation Order Received",
                text: `Hello ${charity.user_id.name},\n\nYou have received a donation order.\n\nProduct: ${product.title}\n\nQuantity: ${quantity}\n\nOrdered by: ${user.name}`
            });
        } catch (err) {
            return res.status(500).json({
                status: "Failed",
                message: err.message
            });
        }
        return res.status(201).json({
            status: "Success",
            message: "Order placed successfully",
            data: order
        });

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}


async function getOrderOfUser(req,res){
    try{
        const order = await Order.find({user_id:req.user_id})  
        if(!order|| order.length === 0){
            return res.status(404).json({
                status:"Failed",
                message:"Order not found"
            })
        }

        return res.status(200).json({
            status:"Success",
            message:"Here is your order",
            data:order
        })
    }catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}

async function getOrderById(req,res){
    try{
        const {id} = req.params
        const order = await Order.findOne({_id:id})  
        if(!order){
            return res.status(404).json({
                status:"Failed",
                message:"Order not found"
            })
        }

        return res.status(200).json({
            status:"Success",
            data:order
        })
    }catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}

async function getOrderByCharityId(req, res) {
    try {
        const { charity_id } = req.params;

        const orders = await Order.find({ charity_id:charity_id })
        if (orders.length === 0) {
            return res.status(404).json({
                status: "Failed",
                message: "No orders found for this charity"
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "Here are the orders under this charity",
            data: orders
        });

    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: err.message
        });
    }
}

module.exports = { placeOrder ,getOrderOfUser,getOrderById,getOrderByCharityId };



























// const Order = require("../models/orderSchema")
// const Product = require("../models/productSchema");
// const Charity = require("../models/charitySchema");


// async function placeOrder(req, res) {
//     try {
//         const { product_id, charity_id, quantity } = req.body
//         const product = await Product.findOne({ _id: product_id })
//         const charity = await Charity.findOne({ _id: charity_id })

//         if (!product) {
//             return res.status(404).json({
//                 status: "Failed",
//                 message: "Product not found"
//             })
//         }

//         if (!charity) {
//             return res.status(404).json({
//                 status: "Failed",
//                 message: "Charity not found"
//             })
//         }

//         if (product.status !== "active") {
//             return res.status(400).json({
//                 status: "failed",
//                 message: "Product must be active!"
//             })
//         }

//         if (charity.status !== "live") {
//             return res.status(400).json({
//                 status: "failed",
//                 message: "Charity must be live!"
//             })
//         }
//         const totAmount = product.price * quantity
//         const order = await Order.create({
//             user_id: req.user_id,
//             product_id,
//             charity_id,
//             quantity,
//             amount: totAmount
//         });

//         return res.status(201).json({
//             status: "success",
//             message: "Order placed successfully",
//             data: order
//         })
//     } catch (err) {
//         return res.status(500).json({
//             status: "Failed",
//             message: err.message
//         })
//     }
// }

// module.exports = { placeOrder }