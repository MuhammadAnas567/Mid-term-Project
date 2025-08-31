const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", authMiddleware(["Admin", "Manager"]), async (req, res) => {
  const products = await Product.find().populate("brand outlet");
  res.json(products);
});

module.exports = router;
