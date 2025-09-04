const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Role = require("../models/Role");
const Outlet = require("../models/Outlet");
const Brand = require("../models/Brand");

exports.getSalesReport = async (req, res) => {
  try {
    const report = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, "$totalAmount", 0]
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: "$totalOrders" },
          completedOrders: {
            $sum: { $cond: [{ $eq: ["$_id", "Completed"] }, "$totalOrders", 0] }
          },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$_id", "Pending"] }, "$totalOrders", 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$_id", "Cancelled"] }, "$totalOrders", 0] }
          },
          totalRevenue: { $sum: "$totalRevenue" }
        }
      },
      { $project: { _id: 0 } }
    ]);
    res.json(report[0] || {});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTopProducts = async (req, res) => {
  try {
    const products = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalQuantity: { $sum: "$products.quantity" },
          totalSales: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] }
          }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productId: "$_id",
          name: "$product.name",
          totalQuantity: 1,
          totalSales: 1
        }
      }
    ]);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsersByRole = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role"
        }
      },
      { $unwind: "$role" },
      {
        $group: {
          _id: "$role.name",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $match: { stock: { $lt: 10 } } },
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand"
        }
      },
      { $unwind: "$brand" },
      {
        $lookup: {
          from: "outlets",
          localField: "outlet",
          foreignField: "_id",
          as: "outlet"
        }
      },
      { $unwind: "$outlet" },
      {
        $project: {
          _id: 0,
          name: 1,
          stock: 1,
          price: 1,
          "brand.name": 1,
          "outlet.name": 1,
          "outlet.location": 1
        }
      }
    ]);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSalesByOutlet = async (req, res) => {
  try {
    const report = await Order.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: "$outlet",
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "outlets",
          localField: "_id",
          foreignField: "_id",
          as: "outlet"
        }
      },
      { $unwind: "$outlet" },
      {
        $project: {
          _id: 0,
          outletId: "$_id",
          outletName: "$outlet.name",
          location: "$outlet.location",
          totalRevenue: 1,
          totalOrders: 1
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
