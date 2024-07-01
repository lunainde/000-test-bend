//server/middleware/jwt.middleware.js

const { expressjwt: jwt } = require("express-jwt");
const Post = require("../models/Post.model");  
// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders, //postman
});
// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  // Check if the token is available on the request Headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    // Get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }
  return null;
}
// Middleware to check if the user owns the resource
const isUserOwner = async (req, res, next) => {
  const userId = req.user._id;
  const resourceId = req.params.userId; // user ID is passed as a parameter
  if (userId !== resourceId) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  next();
};
// Middleware to check if the user owns the post POST OWNERSHIP 2
const isPostOwner = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.payload._id.toString()) {  // use req.payload._id instead of req.user._id
      return res.status(403).json({ message: "You are not authorized to perform this action" });
    }

    next();
  } catch (error) {
    next(error);
  }
};
// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
  isUserOwner,
  isPostOwner, 
};