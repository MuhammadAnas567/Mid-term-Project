const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/sales", authMiddleware(["Admin", "Manager"]), reportsController.getSalesReport);
router.get("/top-products", authMiddleware(["Admin", "Manager"]), reportsController.getTopProducts);
router.get("/users-by-role", authMiddleware(["Admin"]), reportsController.getUsersByRole);
router.get("/low-stock", authMiddleware(["Admin", "Manager"]), reportsController.getLowStockProducts);
router.get("/sales-by-outlet", authMiddleware(["Admin", "Manager"]), reportsController.getSalesByOutlet);

module.exports = router;
