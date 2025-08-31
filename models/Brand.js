const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    picture: { type: String },
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
