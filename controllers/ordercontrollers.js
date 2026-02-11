const Order = require("../models/order");
const Cart = require("../models/cart");

//--- CREATE ORDER
//----in this step we are asking to convert user cart into order
//User + Token → find active cart → create order → calculate total →
// set paymentStatus → save order → clear cart → set cart.status = ordered

exports.createOrder = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    //-- first we are gona find the cart then we can go further
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product",
    );

    if (!cart || cart.products.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    let totalAmount = 0;
    const orderProducts = cart.products.map((item) => {
      totalAmount += item.product.price * item.quantity;

      return {
        product: item.product._id,
        price: item.product.price,
        quantity: item.quantity,
      };
    });

    const order = new Order({
      user: req.user._id,
      products: orderProducts,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "CARD" ? "paid" : "pending",
    });

    await order.save();

    //---- clear cart after order
    cart.products = [];
    cart.status = "ordered";
    await cart.save();

    res.status(200).json({ message: "Order is placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//----- GET ALL ORDERS OF MINE
exports.userOrders = async (req, res) => {
  try {
    const orders = await Order.findOne({ user: req.user._id })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//-- get a single order
exports.singleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.product")
      .populate("user");

    if (!order) return res.status(404).json({ message: "Orders not found " });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//-- Update an order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "There is no order found" });

    const allowedStatus = ["pending", "confirmed", "shipped", "delivered"];
    if (!allowedStatus)
      return res.status(400).json({ message: "Invalid Status value" });

    if (order.status === "delivered")
      return res
        .status(400)
        .json({ message: "Delivered order cannot be updated" });

    order.status = req.body.status;
    await order.save();

    res
      .status(200)
      .json({ message: "Order status is updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
