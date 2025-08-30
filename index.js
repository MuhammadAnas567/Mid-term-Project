const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const {Connect} = require("./models/connection");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());
Connect()

app.use("/auth", authRoutes);

app.get("/admin", authMiddleware(["Admin"]), (req, res) => {
  res.json({ message: "Welcome Admin, you have access!" });
});

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
