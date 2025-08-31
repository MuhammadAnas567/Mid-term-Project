const express = require("express");
const router = express.Router();
const Outlet = require("../models/Outlet");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const outlet = new Outlet(req.body);
    await outlet.save();
    res.json(outlet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", authMiddleware(["Admin", "Manager"]), async (req, res) => {
  try {
    const outlets = await Outlet.find().populate("brand");
    res.json(outlets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authMiddleware(["Admin", "Manager"]), async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id).populate("brand");
    if (!outlet) return res.status(404).json({ error: "Outlet not found" });
    res.json(outlet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!outlet) return res.status(404).json({ error: "Outlet not found" });
    res.json(outlet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndDelete(req.params.id);
    if (!outlet) return res.status(404).json({ error: "Outlet not found" });
    res.json({ message: "Outlet deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
