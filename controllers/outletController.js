const Outlet = require("../models/Outlet");
const paginate = require("../utils/pagination");

exports.createOutlet = async (req, res) => {
  try {
    const { name, location, brand } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: "Name and location are required" });
    }

    const outletData = { name, location, brand };

    if (req.file) {
      outletData.picture = req.file.path;
    }

    const outlet = new Outlet(outletData);
    await outlet.save();

    res.status(201).json({ success: true, data: outlet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOutlets = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await paginate(
      Outlet.find().populate("brand"), // supports populate
      parseInt(page),
      parseInt(limit)
    );

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOutletById = async (req, res) => {
  try {
    const outlet = await Outlet.findById(req.params.id).populate("brand");
    if (!outlet) return res.status(404).json({ error: "Outlet not found" });
    res.json({ success: true, data: outlet });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOutlet = async (req, res) => {
  try {
    const { name, location, brand } = req.body;

    const updateData = { name, location, brand };
    if (req.file) {
      updateData.picture = req.file.path;
    }

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

exports.deleteOutlet = async (req, res) => {
  try {
    const outlet = await Outlet.findByIdAndDelete(req.params.id);
    if (!outlet) return res.status(404).json({ error: "Outlet not found" });
    res.json({ success: true, message: "Outlet deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
