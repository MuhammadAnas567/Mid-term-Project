require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Role = require("./models/Role");
const Brand = require("./models/Brand");
const Outlet = require("./models/Outlet");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/posdb";
const SHOULD_RESET = process.argv.includes("--reset");

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" DB Connected");

    if (SHOULD_RESET) {
      await Promise.all([
        Role.deleteMany({}),
        Brand.deleteMany({}),
        Outlet.deleteMany({}),
        User.deleteMany({}),
        Product.deleteMany({}),
        Order.deleteMany({}),
      ]);
      console.log("Old Data Cleared");
    }

    const roles = await Role.insertMany(
      ["Admin", "Manager", "Cashier", "Staff", "Customer"].map((r) => ({ name: r }))
    );
    console.log("Roles inserted");

    const brands = await Brand.insertMany([
      { name: "Nike", description: "Sportswear", picture: "nike.png" },
      { name: "Adidas", description: "Athletic wear", picture: "adidas.png" },
      { name: "Puma", description: "Shoes & Apparel", picture: "puma.png" },
      { name: "Reebok", description: "Fitness products", picture: "reebok.png" },
      { name: "Local Brand", description: "In-house items", picture: "local.png" },
    ]);
    console.log("Brands inserted");

    const outlets = await Outlet.insertMany([
      { name: "Main Branch", location: "Karachi", brand: brands[0]._id, picture: "main.png" },
      { name: "Bahria Town", location: "Lahore", brand: brands[1]._id, picture: "bahria.png" },
      { name: "DHA Branch", location: "Islamabad", brand: brands[2]._id, picture: "dha.png" },
      { name: "Clifton Outlet", location: "Karachi", brand: brands[3]._id, picture: "clifton.png" },
      { name: "Multan Branch", location: "Multan", brand: brands[4]._id, picture: "multan.png" },
    ]);
    console.log("Outlets inserted");

    const hashedPasswords = await Promise.all([
      bcrypt.hash("admin123", 10),
      bcrypt.hash("manager123", 10),
      bcrypt.hash("cashier123", 10),
      bcrypt.hash("staff123", 10),
      bcrypt.hash("customer123", 10),
    ]);

    const users = await User.insertMany([
      { name: "Super Admin", email: "admin@pos.com", password: hashedPasswords[0], role: roles[0]._id, outlet: outlets[0]._id },
      { name: "Branch Manager", email: "manager@pos.com", password: hashedPasswords[1], role: roles[1]._id, outlet: outlets[1]._id },
      { name: "Front Cashier", email: "cashier@pos.com", password: hashedPasswords[2], role: roles[2]._id, outlet: outlets[2]._id },
      { name: "Staff Member", email: "staff@pos.com", password: hashedPasswords[3], role: roles[3]._id, outlet: outlets[3]._id },
      { name: "Customer User", email: "customer@pos.com", password: hashedPasswords[4], role: roles[4]._id, outlet: outlets[4]._id },
    ]);
    console.log("Users inserted (login: admin@pos.com / admin123)");

    const products = await Product.insertMany([
      { name: "Nike Air Zoom", price: 15000, stock: 20, brand: brands[0]._id, outlet: outlets[0]._id, picture: "nike-shoes.png" },
      { name: "Adidas Ultraboost", price: 18000, stock: 15, brand: brands[1]._id, outlet: outlets[1]._id, picture: "adidas-shoes.png" },
      { name: "Puma T-Shirt", price: 2500, stock: 50, brand: brands[2]._id, outlet: outlets[2]._id, picture: "puma-tee.png" },
      { name: "Reebok Shorts", price: 3000, stock: 30, brand: brands[3]._id, outlet: outlets[3]._id, picture: "reebok-shorts.png" },
      { name: "Local Cap", price: 1200, stock: 100, brand: brands[4]._id, outlet: outlets[4]._id, picture: "local-cap.png" },
    ]);
    console.log("Products inserted");

    const orders = await Order.insertMany([
      {
        user: users[2]._id,
        outlet: outlets[0]._id,
        products: [{ product: products[0]._id, quantity: 1, price: products[0].price }],
        totalAmount: products[0].price,
        status: "Completed",
      },
      {
        user: users[2]._id,
        outlet: outlets[1]._id,
        products: [{ product: products[1]._id, quantity: 2, price: products[1].price }],
        totalAmount: products[1].price * 2,
        status: "Pending",
      },
      {
        user: users[3]._id,
        outlet: outlets[2]._id,
        products: [{ product: products[2]._id, quantity: 3, price: products[2].price }],
        totalAmount: products[2].price * 3,
        status: "Completed",
      },
      {
        user: users[4]._id,
        outlet: outlets[3]._id,
        products: [{ product: products[3]._id, quantity: 1, price: products[3].price }],
        totalAmount: products[3].price,
        status: "Cancelled",
      },
      {
        user: users[1]._id,
        outlet: outlets[4]._id,
        products: [{ product: products[4]._id, quantity: 5, price: products[4].price }],
        totalAmount: products[4].price * 5,
        status: "Completed",
      },
    ]);
    console.log("Orders inserted");

    console.log("Seeding Done Successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding Error:", err);
    process.exit(1);
  }
};

seed();
