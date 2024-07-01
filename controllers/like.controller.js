// server/controller/like.controller.js
const Like = require("../models/Like.model");
const User = require("../models/User.model");
const Post = require("../models/Post.model");

// Like an item
exports.likeItem = async (req, res, next) => {
  const { userId, itemId, itemType } = req.body;

  try {
    const existingLike = await Like.findOne({ userId, itemId, itemType });

    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You have already liked this item." });
    }

    const like = new Like({ userId, itemId, itemType });

    await like.save();

    res.status(200).json({ message: "Item liked successfully." });
  } catch (error) {
    next(error);
  }
};

// Get like count for an item
exports.getLikeCount = async (req, res, next) => {
  const { itemId, itemType } = req.params;

  try {
    const likeCount = await Like.countDocuments({ itemId, itemType });
    res.status(200).json({ likeCount });
  } catch (error) {
    next(error);
  }
};

exports.checkUserLikesPost = async (req, res, next) => {
  const { userId, itemId } = req.params;

  try {
    const existingLike = await Like.findOne({
      userId,
      itemId,
      itemType: "post",
    });
    res.status(200).json({ liked: !!existingLike });
  } catch (error) {
    next(error);
  }
};

// Delete like for an item
exports.deleteLike = async (req, res, next) => {
  const { postId, userId } = req.params;

  try {
    const existingLike = await Like.findOneAndDelete({
      userId,
      itemId: postId,
    });

    if (!existingLike) {
      console.log("userId -> " + userId);
      console.log("postId -> " + userId);
      return res.status(404).json({ message: "Like not found." });
    }

    res.status(200).json({ message: "Like deleted successfully." });
  } catch (error) {
    next(error);
  }
};
