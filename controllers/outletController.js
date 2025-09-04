// controllers/outletController.js
const Outlet = require("../models/Outlet");
const paginate = require("../utils/pagination");


// Create a new outlet
exports.createOutlet = async (req, res) => {
  try {
    const { location, brand } = req.body;

    if (!location || !brand) {
      return res.status(400).json({ error: "Location & Brand ID are required" });
    }

    const outletData = { location, brand };

    const outlet = new Outlet(outletData);
    await outlet.save();

    res.status(201).json({ success: true, data: outlet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all outlets (with pagination + brand populate)
exports.getAllOutlets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await paginate(Outlet, page, limit);

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get outlet by ID
exports.getOutletById = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const outlet = await paginate(Outlet, page, limit, { "brand": req.params.id }, ['brand'])

    if (!outlet) {
      return res.status(404).json({ error: "outlet not found" });
    }

    res.status(200).json({ success: true, data: outlet });
    res.json({ success: true, data: outlet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update outlet
exports.updateOutlet = async (req, res) => {
  try {
    const { location, brand } = req.body;

    const updateData = { location, brand };

    const outlet = await Outlet.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("brand");

    if (!outlet) return res.status(404).json({ error: "Outlet not found" });

    res.json({ success: true, data: outlet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete outlet
exports.deleteOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndDelete(req.params.id);
    if (!outlet) return res.status(404).json({ error: "Outlet not found" });
    res.json({ success: true, message: "Outlet deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
