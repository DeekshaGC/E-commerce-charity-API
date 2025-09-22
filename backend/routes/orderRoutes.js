const express = require("express")
const router = express.Router()
const {authenticateUser} = require("../middlewares/auth")
const {orderValidationSchema,validateOrder} = require("../middlewares/validateOrder")
const {placeOrder, getOrderOfUser,getOrderById,getOrderByCharityId} =  require("../controllers/order")

router.post("/",authenticateUser,orderValidationSchema,validateOrder,placeOrder)
router.get("/",authenticateUser,getOrderOfUser)
router.get("/:id",authenticateUser,getOrderById)
router.get("/charity/:charity_id",authenticateUser,getOrderByCharityId)

module.exports = router