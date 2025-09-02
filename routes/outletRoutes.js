const express = require("express");
const router = express.Router();
const outletController = require("../controllers/outletController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

// Public routes
router.get("/", outletController.getAllOutlets);
router.get("/:id", outletController.getOutletById);

// Admin-only routes
router.post(
  "/",
  authMiddleware(["Admin"]),
  upload.single("picture"),
  outletController.createOutlet
);

router.put(
  "/:id",
  authMiddleware(["Admin"]),
  upload.single("picture"),
  outletController.updateOutlet
);

router.delete(
  "/:id",
  authMiddleware(["Admin"]),
  outletController.deleteOutlet
);

module.exports = router;
