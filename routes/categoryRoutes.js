const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/multer");
const { categoryValidationSchema, validateCategory } = require("../middlewares/validateCategory");
const { createCategory, getAllCategories,getCategoriesOfAdmin, updateCategory } = require("../controllers/category");


router.post( "/", authenticateUser, uploadImage, categoryValidationSchema, validateCategory, createCategory);
router.get("/",getAllCategories)
router.get("/admin",authenticateUser,getCategoriesOfAdmin)
router.patch("/:id",authenticateUser, updateCategory)

module.exports = router;
