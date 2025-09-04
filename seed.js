const fs = require("fs");
const path = require("path");

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Models
const Role = require("./models/Role");
const Brand = require("./models/Brand");
const Outlet = require("./models/Outlet");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

// Dummy Data
const brandsData = require("./dummyData/Brands.json");
const outletsData = require("./dummyData/Outlets.json");
const productsData = require("./dummyData/Products.json");
const ordersData = require("./dummyData/Orders.json");
const usersData = require("./dummyData/Users.json");

// Flags
const SHOULD_RESET = process.argv.includes("--reset");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");

    if (SHOULD_RESET) {
      await Promise.all([
        Role.deleteMany(),
        Brand.deleteMany(),
        Outlet.deleteMany(),
        User.deleteMany(),
        Product.deleteMany(),
        Order.deleteMany(),
      ]);
      console.log("Old Data Cleared");
    }

    // Insert Roles
    const roles = await Role.insertMany(
      ["Admin", "Manager", "Cashier", "Staff", "Customer"].map((r) => ({
        name: r,
      }))
    );
    console.log(`✅ Roles Inserted (${roles.length})`);

    // Insert Brands
    const brands = await Brand.insertMany(brandsData);
    console.log(`✅ Brands Inserted (${brands.length})`);

    // Map outlets with brand IDs
    const mappedOutlets = outletsData.map((o) => ({
      ...o,
      brand: brands[o.brandIndex]?._id,
    }));
    const outlets = await Outlet.insertMany(mappedOutlets);
    console.log(`✅ Outlets Inserted (${outlets.length})`);

    // Insert Users from JSON
    const hashedUsers = await Promise.all(
      usersData.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
        role: roles[u.roleIndex]?._id,
        outlet: outlets[u.outletIndex]?._id,
      }))
    );
    const users = await User.insertMany(hashedUsers);
    console.log(`✅ Users Inserted (${users.length})`);

    // Map products with brand & outlet IDs
    const mappedProducts = productsData.map((p) => ({
      ...p,
      brand: brands[p.brandIndex]?._id,
      outlet: outlets[p.outletIndex]?._id,
    }));
    const products = await Product.insertMany(mappedProducts);
    console.log(`✅ Products Inserted (${products.length})`);

    const ordersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "dummyData", "Orders.json"), "utf-8")
    );

    const mappedOrders = ordersData.map((order) => ({
      user: users[order.user]._id, // map index → real ID
      outlet: outlets[order.outlet]._id,
      products: order.products.map((p) => ({
        product: products[p.product]._id,
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount: order.totalAmount,
      status: order.status,
    }));

    await Order.insertMany(mappedOrders);
    console.log(`✅ Orders Inserted (${mappedOrders.length})`);

    console.log("🎉 Seeding Completed Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seed();
