/*Cart products ke baghair exist nahi karti
Order products ke baghair place nahi hota
Frontend products ke baghair kuch bhi nahi dikha sakta */

const Product = require("../models/product");

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(200).json({ message: "Product is created succesfully" });
};

exports.allProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

exports.oneProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

exports.updateProduct = async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );

  res.json(updatedProduct);
};

exports.removeProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
     res.status(200).json({ message : "Product is deleted succesfully!"})
};
