const Role = require("../models/Role");

// Create Role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = new Role({ name, permissions });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Roles with Pagination
exports.getRoles = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query; // Default page=1, limit=10
    page = parseInt(page);
    limit = parseInt(limit);

    const roles = await Role.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalRoles = await Role.countDocuments();

    res.json({
      total: totalRoles,
      page,
      pages: Math.ceil(totalRoles / limit),
      roles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Role
exports.updateRole = async (req, res) => {
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
};

// Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) return res.status(404).json({ error: "Role not found" });
    res.json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
