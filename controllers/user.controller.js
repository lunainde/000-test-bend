//server/controllers/user.controller.js
const User = require("../models/User.model");

// Function to get user by ID
exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (err) {
    throw new Error("Error fetching user");
  }
};

//GET LAST 3 RECENT USERS- STARTUP
exports.getRecentStartups = async (req, res, next) => {
  try {
    const users = await User.find({ category: "Startup" })
      .sort({ createdAt: -1 })
      .limit(3);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// // UPDATE USER
//   exports.updateUser = async (req, res, next) => {
//     try {
//       const { userId } = req.params;
//       const updatedData = req.body;
//       const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
//       res.status(200).json(updatedUser);
//     } catch (error) {
//       next(error);
//     }
//   };

// Update User
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.payload._id; // Fixed user ID retrieval
    const updatedData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete User
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.payload._id; // Fixed user ID retrieval
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
