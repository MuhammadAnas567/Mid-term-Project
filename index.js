const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const {Connect} = require("./models/connection");
const authMiddleware = require("./middleware/authMiddleware");
const roleRoutes = require("./routes/roleRoutes");
const brandRoutes = require("./routes/brandRoutes");
const outletRoutes = require("./routes/outletRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(express.json());
Connect()

app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/brands", brandRoutes);
app.use("/outlets", outletRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.get("/admin", authMiddleware(["Admin"]), (req, res) => {
  res.json({ message: "Welcome Admin, you have access!" });
});

app.listen(process.env.PORT, () => console.log(`Server run on port ${process.env.PORT}`))
