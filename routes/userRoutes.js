const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", authMiddleware(["Admin"]), async (req, res) => {
  const users = await User.find().populate("role");
  res.json(users);
});

module.exports = router;
