//server/routes/like.routes.js
const express = require("express");
const router = express.Router();
const likeController = require("../controllers/like.controller");

// Like an item
router.post("/like", likeController.likeItem);

// Like an item
router.delete("/like/post/:postId/user/:userId", likeController.deleteLike);

// Get like count for an item
router.get("/like/:itemId/:itemType", likeController.getLikeCount);

// Check if a user has liked a post
router.get("/like/:userId/:itemId/check", likeController.checkUserLikesPost);

module.exports = router;
