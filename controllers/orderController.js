const Order = require("../models/Order");
const Product = require("../models/Product");
const paginate = require("../utils/pagination");


// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { user, outlet, products } = req.body;

    if (!user || !outlet || !products || products.length === 0) {
      return res.status(400).json({ error: "User, outlet, and products are required" });
    }

    let total = 0;
    for (let item of products) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) return res.status(404).json({ error: "Product not found" });
      total += item.quantity * dbProduct.price;
    }

    const orderData = { user, outlet, products, totalAmount: total };

    if (req.file) {
      orderData.picture = req.file.path; // store uploaded receipt/invoice
    }

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all orders (with pagination)
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await paginate(
      Order.find().populate("user outlet products.product"),
      page,
      limit
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user outlet products.product");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const updateData = req.body;

    if (req.file) {
      updateData.picture = req.file.path;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("user outlet products.product");

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
