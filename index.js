const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const { Connect } = require("./utils/connection");
const authMiddleware = require("./middleware/authMiddleware");
const roleRoutes = require("./routes/roleRoutes");
const brandRoutes = require("./routes/brandRoutes");
const outletRoutes = require("./routes/outletRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
Connect();

app.use("/auth", authRoutes); // Working
app.use("/roles", roleRoutes); // Working
app.use("/brands", brandRoutes); // Working
app.use("/outlets", outletRoutes); // Working
app.use("/users", userRoutes); // Working
app.use("/products", productRoutes); // Working
app.use("/orders", orderRoutes); 

app.get("/admin", authMiddleware(["Admin"]), (req, res) => {
  res.json({ message: "Welcome Admin, you have access!" });
});

app.listen(process.env.PORT, () =>
  console.log(`Server run on port ${process.env.PORT}`)
);
