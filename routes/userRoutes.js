const express = require("express");
const router = express.Router();
const multer = require("multer");
const userController = require("../controllers/userController");

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Auth Routes
router.post("/register", upload.single("picture"), userController.register);
router.post("/login", userController.login);

// CRUD Routes
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", upload.single("picture"), userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
