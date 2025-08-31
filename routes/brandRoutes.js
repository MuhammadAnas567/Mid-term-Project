const express = require("express");
const Brand = require("../models/Brand");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    res.json(brand);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", authMiddleware(), async (req, res) => {
  const brands = await Brand.find();
  res.json(brands);
});

router.put("/:id", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(brand);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware(["Admin"]), async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    res.json({ message: "Brand deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
