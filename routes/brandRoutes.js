// routes/brandRoutes.js
const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const upload = require("../utils/upload"); // multer setup
const authMiddleware = require("../middleware/authMiddleware"); // your auth middleware

router.post(
  "/",
  authMiddleware(["Admin"]),
  upload.single("picture"),
  brandController.createBrand
);

router.get("/", brandController.getBrands);

router.get("/:id", brandController.getBrandById);

router.put(
  "/:id",
  authMiddleware(["Admin"]),
  upload.single("picture"),
  brandController.updateBrand
);

router.delete(
  "/:id",
  authMiddleware(["Admin"]),
  brandController.deleteBrand
);

module.exports = router;
