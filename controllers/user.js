const User = require("../models/users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const jwt_key = process.env.JWT_SECRETE_KEY

async function register(req, res) {
    try {
        const { email, password } = req.body
        let existing_user = await User.findOne({ email: email })
        if (existing_user) {
            return res.status(400).json({
                status: "Failed",
                message: "User already exists"
            })
        } else {
            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    return res.status(400).json({
                        status: "Failed",
                        message: "Error while hashing"
                    })
                }

                let user = {
                    email,
                    password: hash
                };
   
                let data = await User.create(user)
                return res.status(201).json({
                    status: "success",
                    message: "Registered successfully!!!",
                    data: {
                        user: data
                    }
                });
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}


async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({
                status: "failed",
                meassage: "User not found"
            })
        } else {
            bcrypt.compare(password, user.password, function (err, result) {
                if (err) {
                    return res.status(400).json({
                        status: "failed",
                        message: "Error while decoding"
                    })
                } else {
                    if (!result) {
                        return res.status(401).json({
                            status: "failed",
                            message: "Invalid password"
                        });
                    }

                    jwt.sign({ user_id:user._id, email }, jwt_key, function (err, token) {
                        console.log(token);
                        if(err){
                            return res.status(500).json({
                                status:"failed",
                                meassage:"Error in creating token"
                            })
                        };
                        res.status(200).json({
                        status: "success",
                        message: "Login successful",
                        token:token
                    });
                        
                    });                  
                }
            });
        }
    } catch (err) {
        res.status(500).json({
            status: "failed",
            message: err.message
        })
    }
}


module.exports = { register, login }