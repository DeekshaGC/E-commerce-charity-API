const { body, validationResult } = require("express-validator");

const addressValidationSchema = [
    body("location")
        .notEmpty().withMessage("Location is required")
        .isString().withMessage("Location must be a string")
        .isLength({ min: 3 }).withMessage("Location must be at least 3 characters long"),

    body("city")
        .notEmpty().withMessage("City is required")
        .isString().withMessage("City must be a string")
        .isLength({ min: 2 }).withMessage("City must be at least 2 characters long"),

    body("pincode")
        .notEmpty().withMessage("Pincode is required")
        .isInt({ min: 100000, max: 999999 }).withMessage("Pincode must be a valid 6-digit number"),

    body("state")
        .notEmpty().withMessage("State is required")
        .isString().withMessage("State must be a string")
        .isLength({ min: 2 }).withMessage("State must be at least 2 characters long"),

    body("country")
        .optional()
        .isString().withMessage("Country must be a string")
        .isLength({ min: 2 }).withMessage("Country must be at least 2 characters long")
];

function validateAddress(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const err = result.array()
        return res.status(400).json({
            message: err[0].msg 
        });
    }
    next();
}

module.exports = { addressValidationSchema, validateAddress };
