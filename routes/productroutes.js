const express = require("express");
const router = express.Router();

const {protect} = require('../middlewares/authmiddleware');
const {adminOnly} = require('../middlewares/adminOnly');

const {
  createProduct,
  allProducts,
  oneProduct,
  updateProduct,
  removeProduct,
} = require("../controllers/productcontrollers");

//-----------public access----------------//
//----get all products(public)
router.get("/allProducts", allProducts);
//----search single product(public)
router.get("/:id", oneProduct);

//------------admin access only-----------//
//----Create products(admin only)
router.post("/create",protect,adminOnly, createProduct);
//----update product
router.put("/update/:id",protect,adminOnly, updateProduct);
//----delete product
router.delete("/:id",protect,adminOnly, removeProduct);

module.exports = router;
