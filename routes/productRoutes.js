const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.post(
  "/",
  authMiddleware(["Admin"]),
  upload.single("picture"),
  productController.createProduct
);
router.put(
  "/:id",
  authMiddleware(["Admin"]),
  upload.single("picture"),
  productController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware(["Admin"]),
  productController.deleteProduct
);

module.exports = router;
