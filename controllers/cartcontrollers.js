const Cart = require("../models/cart");
const product = require("../models/product");
const Product = require("../models/product");

//---Adding a new product to a cart
exports.addtoCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id, status:"active"});
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        products: [
          {
            product: productId,
            quantity,
          },
        ],
      });
    } else {

     const itemIndex = cart.products.findIndex((p) => p.product.equals(productId));

      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//---geting a view of cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product",
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//---updating the quantity of items
exports.updateCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: " Cart not found" });

    const itemIndex = cart.products.findIndex((p) => (p.product = productId));

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity = quantity;
      await cart.save();
    } else {
      res.status(404).json({ message: "Product not in cart" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//---deleting the item from the list
exports.removefromCart = async (req, res) => {
  const { productId } = req.body;
  try {
    let cart = await Cart.findOne({user : req.user._id});
    if (!cart)
      return res.status(404).json({ message: " Cart is not available" });

    cart.products = cart.products.filter((p) => p.product.toString() !== productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
