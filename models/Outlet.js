const mongoose = require("mongoose");

const outletSchema = new mongoose.Schema(
  {
    location: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Outlet", outletSchema);
