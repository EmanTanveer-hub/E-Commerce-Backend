const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authmiddleware");
const {
  createOrder,
  userOrders,
  singleOrder,
  updateOrderStatus,
} = require("../controllers/ordercontrollers");
const {adminOnly} = require("../middlewares/adminOnly")

//---CREATE ORDER ROUTE
router.post("/create", protect, createOrder);
//---used to get all orders
router.get("/orders", protect, userOrders);
//---used to get a single order
router.get("/order/:id", protect, singleOrder);
//----used to update the order status of the order
router.put("/admin/order/:id",protect, adminOnly ,updateOrderStatus);

module.exports = router;
