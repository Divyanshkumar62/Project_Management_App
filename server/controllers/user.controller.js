const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sanitizeBio } = require("../utils/sanitize");

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

const updateMe = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation error", 
        details: errors.array() 
      });
    }

    const { name, bio, timezone, notificationPrefs } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = sanitizeBio(bio);
    if (timezone) user.timezone = timezone;
    if (notificationPrefs) user.notificationPrefs = { ...user.notificationPrefs, ...notificationPrefs };

    await user.save();
    
    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

const updatePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Validation error", 
        details: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await user.matchPassword(currentPassword);
    if (!match) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ message: "Error updating password" });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.avatarUrl = `http://localhost:5001/uploads/avatars/${req.file.filename}`;
    await user.save();
    
    res.json({ avatarUrl: user.avatarUrl });
  } catch (err) {
    console.error("Update avatar error:", err);
    res.status(500).json({ message: "Error updating avatar" });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("_id name avatarUrl bio");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get public profile error:", err);
    res.status(500).json({ message: "Error fetching public profile" });
  }
};

module.exports = {
  getMe,
  updateMe,
  updatePassword,
  updateAvatar,
  getPublicProfile,
};
