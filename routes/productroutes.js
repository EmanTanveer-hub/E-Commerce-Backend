const express = require("express");
const router = express.Router();

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
router.post("/create", createProduct);
//----update product
router.put("/update/:id", updateProduct);
//----delete product
router.delete("/:id", removeProduct);

module.exports = router;
