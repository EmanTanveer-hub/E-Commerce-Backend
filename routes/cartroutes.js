const express = require("express");
const router = express.Router();

const {protect} = require("../middlewares/authmiddleware"); 
const {
  addtoCart,
  getCart,
  updateCart,
  removefromCart,
} = require("../controllers/cartcontrollers");

// Cart routes(customer routes)
//--when user add a product in a cart by clicking(Add to Cart)button
router.post("/addtocart", protect , addtoCart);

//--When user opens the cart by clicking Cart icon then list of products appear
router.get("/cart", protect , getCart);

//--When user add a product or if user removes it it updates the quantity of the product in backend
//--using (+) or (-) symbols
router.put("/update", protect , updateCart);

// DELETE item from this cart when user removes or delete item from cart
router.delete("/removefromcart", protect , removefromCart);

module.exports = router;
