const express = require("express");
const router = express.Router();
const Role = require("../models/Role");
const authMiddleware = require("../middleware/authMiddleware"); 

router.post("/", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = new Role({ name, permissions });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions },
      { new: true }
    );
    if (!updatedRole) return res.status(404).json({ error: "Role not found" });
    res.json(updatedRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authMiddleware(["Admin"]), async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) return res.status(404).json({ error: "Role not found" });
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
