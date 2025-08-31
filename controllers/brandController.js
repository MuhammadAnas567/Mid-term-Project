const Brand = require("../models/brandModel");
const paginate = require("../utils/pagination");

// ✅ Create brand
exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    const brand = new Brand({
      name,
      description,
      picture: req.file ? req.file.filename : null,
    });

    await brand.save();
    res.status(201).json({ message: "Brand created successfully", brand });
  } catch (error) {
    res.status(500).json({ message: "Error creating brand", error: error.message });
  }
};

// ✅ Get brands with pagination (using paginate.js)
exports.getBrands = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await paginate(Brand, parseInt(page), parseInt(limit));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching brands", error: error.message });
  }
};

// ✅ Get single brand
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ message: "Brand not found" });

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: "Error fetching brand", error: error.message });
  }
};

// ✅ Update brand
exports.updateBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedBrand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        picture: req.file ? req.file.filename : undefined,
      },
      { new: true }
    );

    if (!updatedBrand) return res.status(404).json({ message: "Brand not found" });

    res.status(200).json({ message: "Brand updated successfully", updatedBrand });
  } catch (error) {
    res.status(500).json({ message: "Error updating brand", error: error.message });
  }
};

// ✅ Delete brand
exports.deleteBrand = async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    if (!deletedBrand) return res.status(404).json({ message: "Brand not found" });

    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting brand", error: error.message });
  }
};
