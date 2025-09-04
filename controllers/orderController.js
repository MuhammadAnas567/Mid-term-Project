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
    const productUpdates = [];

    for (let item of products) {
      const dbProduct = await Product.findById(item.product);

      if (!dbProduct) {
        return res.status(404).json({ error: `Product not found: ${item.product}` });
      }

      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({
          error: `Product "${dbProduct.name}" does not have enough stock. Available: ${dbProduct.stock}, Requested: ${item.quantity}`,
        });
      }

      total += item.quantity * dbProduct.price;

      productUpdates.push({
        id: dbProduct._id,
        quantity: item.quantity,
        price:item.price
      });
    }

    const orderData = { user, outlet, products, totalAmount: total };

    const order = new Order(orderData);
    await order.save();

    for (let item of productUpdates) {
      await Product.findByIdAndUpdate(item.id, { $inc: { stock: -item.quantity } });
    }


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orderPlaced = await paginate(Order, page, limit, { "_id": order._id }, [{ path: "user", select: "-password" }, "outlet", "outlet.brand", "products", "products.product"])

    res.status(201).json({ success: true, data: orderPlaced });


  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all orders (with pagination)
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await paginate(Order, page, limit, {}, [{ path: "user", select: "-password" }, "outlet", "outlet.brand", "products", "products.product"])

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const order = await paginate(Order, page, limit, { "_id": req.params.id }, [{path:"user", select:"-password"}, "outlet", "products", "products.product"])

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
