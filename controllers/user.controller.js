//server/controllers/user.controller.js
const User = require("../models/User.model");
const Post = require("../models/Post.model");
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

// UPDATE USER
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

// DELETE User
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.payload._id; // Fixed user ID retrieval
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET User's BOOKMARKED posts
exports.getUserBookmarks = async (req, res, next) => {
  try {
    const userId = req.payload._id; // Get user ID from the authenticated payload
    const user = await User.findById(userId).populate('bookmarks'); // Find user and populate bookmarks

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.bookmarks); // Return the populated bookmarks
  } catch (error) {
    next(error);
  }
};

// FAVORITES => ADD STARTUP TO USER'S 
exports.addFavoriteStartup = async (req, res, next) => {
  const userId = req.payload._id; // Get user id from autenticated paylad
  const { startupId } = req.body; // get startup id from requested body

  try {
    const user = await User.findById(userId); // find user by id

    if (!user) {
      return res.status(404).json({ message: "User not found" }); 
    }

    // ADD STARTUP ID TO FAVORITES IF NOT ALREADY INCLUDED
    if (!user.favoriteStartups.includes(startupId)) {
      user.favoriteStartups.push(startupId);
      await user.save(); // SAVE THE UPDATED USER
    }

    res.status(200).json({ message: "Startup added to favorites" }); // RETURN SUCCESS MESSAGE
  } catch (error) {
    next(error);
  }
};

// FAVORITES => REMOVE A STARTUP FROM USER'S  
exports.removeFavoriteStartup = async (req, res, next) => {
  const userId = req.payload._id; // Get user id from autenticated paylad
  const { startupId } = req.body; // get startup id from requested body

  try {
    const user = await User.findById(userId); //find user by id

    if (!user) {
      return res.status(404).json({ message: "User not found" }); 
    }

    // REMOVE STARTUP ID FROM FAVORITES
    user.favoriteStartups = user.favoriteStartups.filter(
      (id) => id.toString() !== startupId
    );
    await user.save(); // save updated user

    res.status(200).json({ message: "Startup removed from favorites" }); 
  } catch (error) {
    next(error);
  }
};

// FAVORITE =>GET USER'S FAV STARTUPS
exports.getFavoriteStartups = async (req, res, next) => {
  const userId = req.payload._id; // Get user id from autenticated paylad

  try {
    const user = await User.findById(userId).populate('favoriteStartups'); // find and populate fav

    if (!user) {
      return res.status(404).json({ message: "User not found" }); 
    }

    res.status(200).json(user.favoriteStartups); // return populated fav
  } catch (error) {
    next(error);
  }
};