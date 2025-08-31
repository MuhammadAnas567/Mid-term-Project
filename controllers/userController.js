const User = require("../models/User");
const paginate = require("../utils/paginate");

// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, outlet } = req.body;
    let picture = null;

    if (req.file) {
      picture = req.file.path; // multer saves the file path
    }

    const user = new User({
      name,
      email,
      password,
      role,
      outlet,
      picture,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Users with pagination
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const users = await paginate(User, page, limit, {});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single User
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role outlet");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (req.file) {
      updates.picture = req.file.path;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
