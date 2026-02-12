const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authmiddleware");
const {
  createOrder,
  userOrders,
  singleOrder,
  updateOrderStatus,cancelOrder
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
//---- when user wants to cancle its own order
router.put("/order/cancel/:id",protect,cancelOrder);
//---- when admin wants to cancel someones order
router.put("/admin/cancel/:id",protect,adminOnly,cancelOrder);

module.exports = router;
