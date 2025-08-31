const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    picture: { type: String },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    outlet: { type: mongoose.Schema.Types.ObjectId, ref: "Outlet" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
