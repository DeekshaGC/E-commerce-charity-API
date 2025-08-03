const express = require("express")
const router = express.Router()
const {authenticateUser} = require("../middlewares/auth")
const {uploadFile} = require("../middlewares/multer")
const {charityValidationSchema,validateCharity } =  require("../middlewares/validateCharity") 
const { createCharity,getAllCharities, getCharitiesOfAdmin } =  require("../controllers/charity")


router.post("/",authenticateUser,uploadFile("banner"),charityValidationSchema,validateCharity,createCharity)
router.get("/",getAllCharities)
router.get("/admin",authenticateUser,getCharitiesOfAdmin)

module.exports = router
