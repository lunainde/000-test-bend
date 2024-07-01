//server/controllers/post.controller.js

const Post = require("../models/Post.model");
const User = require("../models/User.model");
const Like = require("../models/Like.model"); // IMPORT THE LIKE MODEL

// CREATE/POST a new post
exports.createPost = async (req, res, next) => {
  try {
    const { imgUrl, title, tags, content, user } = req.body;
    const newPost = await Post.create({
      imgUrl,
      title,
      tags,
      content,
      user,
    });
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

// GET POST BY ID
exports.getPostById = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("user");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// GET ALL posts
exports.getAllPosts = async (req, res, next) => {
  try {
    // Fetch all posts and populate the user field
    const posts = await Post.find().populate("user");

    // Fetch like counts for each post
    const postWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await Like.countDocuments({
          itemId: post._id,
          itemType: "post",
        });
        return { ...post._doc, likeCount };
      })
    );

    res.status(200).json(postWithLikes);
  } catch (error) {
    next(error);
  }
};

// GET 3 LAST POSTS
exports.getRecentPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("user");
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// UPDATE a post
exports.updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { imgUrl, title, tags, content } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.payload._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { imgUrl, title, tags, content },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// DELETE a post
exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// BOOKMARK a post
exports.bookmarkPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.payload._id;

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) {
      return res.status(404).json({ message: "Post or User not found" });
    }

    // Add post to user's bookmarks if not already bookmarked
    if (!user.bookmarks.includes(postId)) {
      user.bookmarks.push(postId);
      post.bookmarkedBy.push(userId);

      await user.save();
      await post.save();
    }

    res.status(200).json({ message: "Post bookmarked successfully" });
  } catch (error) {
    next(error);
  }
};

// UNBOOKMARK a post
exports.unbookmarkPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const userId = req.payload._id;

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) {
      return res.status(404).json({ message: "Post or User not found" });
    }

    // Remove post from user's bookmarks if bookmarked
    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.toString() !== postId
    );
    post.bookmarkedBy = post.bookmarkedBy.filter(
      (bookmark) => bookmark.toString() !== userId
    );
    await user.save();
    await post.save();

    res.status(200).json({ message: "Post unbookmarked successfully" });
  } catch (error) {
    next(error);
  }
};
