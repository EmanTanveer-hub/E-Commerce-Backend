const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");

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

    //----There i have to check rather the product is in stock or not
    let adjustedProducts = [];

    for (let item of cart.products) {
      const product = await Product.findById(item.product);

      if (!product)
        return res.status(404).json({ message: "Product is out of Stock" });

      if (product.stock < item.quantity) {
        adjustedProducts.push({
          name: product.name, //--your selected product name
          available: product.stock, //-- is waqt stock ma kitni items hain
          requested: item.quantity, //---vo quantity jo hum se user na mangi ha
        });
        item.quantity = product.stock; //----Here i am automatically adjusting the quantity of the products
      }
    }

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

    //---- Here i am going to tell my user that i had automatically adjusted the quqnatity of products

    let message = "Order is placed succesfully";
    if (adjustedProducts.length > 0) {
      const details = adjustedProducts
        .map(
          (p) =>
            `${p.name} : requested ${p.requested} , available${p.available}`,
        )
        .join(", ");
      message += `Note: Quantities adjusted due to stock limits: ${details}`;
    }

    res.status(200).json({ message, order });
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
    if (!allowedStatus.includes(req.body.status))
      return res.status(400).json({ message: "Invalid Status value" });

    if (order.status === "delivered")
      return res
        .status(400)
        .json({ message: "Delivered order cannot be updated" });

    //---- Here i am going to add if order is confirmed then i am gonna reduce stock number
    if (order.status === "confirmed" && order.status !== "confirmed") {
      for (let item of order.products) {
        const product = await Product.findById(item.product);
        product.stock -= item.quantity;
        await product.save();
      }
    }

    order.status = req.body.status;
    await order.save();

    res
      .status(200)
      .json({ message: "Order status is updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//---- if the user wants to cancel any order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findbyId(req.params.id);

    if (!order)
      return res.status(404).json({ message: "There is no order found" });

    //---An order can be cancelled it is confirmed or pending
    if (order.status === "shipped" || order.status === "delivered")
      return res
        .status(400)
        .json({ message: "Shipped or delivered orders cannot be cancelled" });

    order.status = "cancelled";

    //---- When a user cancels an order i added a feature that automatically
    //  updates the Stock quantity of product So that other users can buy it
    for (let item of order.products) {
      const product = await Product.findbyId(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await order.save();

    res.status(200).json({ message: "Order cancelled succesfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
