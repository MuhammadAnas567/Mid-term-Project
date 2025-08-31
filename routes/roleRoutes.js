const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleController = require("../controllers/roleController");

router.post("/", authMiddleware(["Admin"]), roleController.createRole);

router.get("/", authMiddleware(["Admin"]), roleController.getRoles);

router.put("/:id", authMiddleware(["Admin"]), roleController.updateRole);

router.delete("/:id", authMiddleware(["Admin"]), roleController.deleteRole);

module.exports = router;
