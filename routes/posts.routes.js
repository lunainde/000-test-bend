//server/routes/posts.routes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated, isPostOwner } = require("../middleware/jwt.middleware");

// GET "/api/posts" => Route to list all available posts
router.get("/", postController.getAllPosts);

// GET "/api/posts/recent-posts" => Route to get the last 3 posts
router.get("/recent", postController.getRecentPosts);

// GET "/api/posts/:postId" => Route to get a specific post by ID
router.get("/:postId", postController.getPostById);

// POST '/api/posts' => for saving a new post in the database
router.post("/", isAuthenticated, postController.createPost);

// PUT '/api/posts/:postId' => for updating a post
router.put("/:postId", isAuthenticated, isPostOwner, postController.updatePost);

// DELETE '/api/posts/:postId' => for deleting a post
router.delete("/:postId", isAuthenticated, isPostOwner, postController.deletePost);

// POST '/api/posts/upload' => for uploading image to Cloudinary
router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ fileUrl: req.file.path });
});

// POST '/api/posts/:postId/bookmark' => for bookmarking a post
router.post("/:postId/bookmark", isAuthenticated, postController.bookmarkPost);

// DELETE '/api/posts/:postId/unbookmark' => for unbookmarking a post
router.delete("/:postId/unbookmark", isAuthenticated, postController.unbookmarkPost);


//-------------LIKE--------------
//### ADD ROUTE FOR LIKING A POST
router.post("/:postId/like", isAuthenticated, postController.likePost);

//### ADD ROUTE FOR UNLIKING A POST
router.delete("/:postId/unlike", isAuthenticated, postController.unlikePost);

module.exports = router;
