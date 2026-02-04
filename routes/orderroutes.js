const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authmiddleware");
const {
  createOrder,
  userOrders,
  singleOrder,
} = require("../controllers/ordercontrollers");

//---CREATE ORDER ROUTE
router.post("/create", protect, createOrder);
//---used to get all orders
router.get("/orders", protect, userOrders);
//---used to get a single order
router.get("/order/:id", protect, singleOrder);

module.exports = router;
