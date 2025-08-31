const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

router.post(
  "/",
  authMiddleware(["Admin", "Manager", "Cashier"]),
  upload.single("picture"),
  orderController.createOrder
);

router.get("/", authMiddleware(["Admin", "Manager"]), orderController.getOrders);

router.get("/:id", authMiddleware(), orderController.getOrderById);

router.put(
  "/:id",
  authMiddleware(["Admin", "Manager"]),
  upload.single("picture"),
  orderController.updateOrder
);

router.delete("/:id", authMiddleware(["Admin"]), orderController.deleteOrder);

module.exports = router;
