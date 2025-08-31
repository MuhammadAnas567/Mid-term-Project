const mongoose = require("mongoose");

const outletSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    picture: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Outlet", outletSchema);
