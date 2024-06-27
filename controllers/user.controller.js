//server/controllers/user.controller.js
const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

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
  const {
    imgUrl,
    siteUrl,
    headline,
    country,
    about,
    email,
    name,
    category,
    tags,
  } = req.body;
  const userId = req.payload._id;

  User.findByIdAndUpdate(
    userId,
    { imgUrl, name, siteUrl, tags, about, country, email, headline, category },
    { new: true }
  )
    .then((updatedUser) => {
      const {
        _id,
        email,
        name,
        imgUrl,
        headline,
        category,
        tags,
        siteUrl,
        about,
        country,
      } = updatedUser;
      const payload = {
        _id,
        email,
        name,
        imgUrl,
        headline,
        category,
        tags,
        siteUrl,
        about,
        country,
      };
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      res.status(200).json({ authToken: authToken, user: payload });
    })
    .catch((err) => next(err));
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
