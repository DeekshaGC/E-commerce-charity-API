const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userSchema");
const jwt_key = process.env.JWT_SECRETE_KEY;

async function authenticateUser(req, res, next) {
    try {
        let token = req.headers["authorization"].split(" ")[1];
        if (!token) {
            return res.status(403).json({
                status: "Failed",
                message: "Unauthorized user"
            });
        }

        let decoded = await jwt.verify(token, jwt_key);
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(401).json({
                status: "Failed",
                message: "User not found"
            });
        }
        req.user = user;         
        req.user_id = user._id;  

        next();
    } catch (err) {
        return res.status(500).json({
            status: "Failed",
            message: "Authentication failed"
        });
    }
}

module.exports = { authenticateUser };
