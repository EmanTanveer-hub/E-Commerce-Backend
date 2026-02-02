const Cart = require("../models/cart");
const product = require("../models/product");
const Product = require("../models/product");

//---Adding a new product to a cart
exports.addtoCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
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
      const itemIndex = cart.products.findIndex((p) => (p.product = productId));
      if (itemIndex > -1) {
        cart.products[itemIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
//---geting a view of cart
exports.getCart = async (req, res) => {};
//---updating the quantity of items
exports.updateCart = async (req, res) => {};
//---deleting the item from the list
exports.removefromCart = async (req, res) => {};
