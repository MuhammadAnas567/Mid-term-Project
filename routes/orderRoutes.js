const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware(["Admin", "Manager", "Cashier"]), async (req, res) => {
  try {
    const { user, outlet, products } = req.body;

    let total = 0;
    for (let item of products) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) return res.status(404).json({ error: "Product not found" });
      total += item.quantity * dbProduct.price;
    }

    const order = new Order({ user, outlet, products, totalAmount: total });
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", authMiddleware(["Admin", "Manager"]), async (req, res) => {
  const orders = await Order.find().populate("user outlet products.product");
  res.json(orders);
});

router.get("/:id", authMiddleware(), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user outlet products.product");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware(["Admin", "Manager"]), async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware(["Admin"]), async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
