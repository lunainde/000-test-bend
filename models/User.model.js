//server/models/User.model.js
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    imgUrl: String,
    siteUrl: String,
    headline: String,
    country: String,
    about: {
      type: String,
      maxlength: [200, "About cannot exceed 200 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      enum: ["investor", "startup", "expert", "organization", "journalist"],
    },
    tags: {
      type: [String],
      required: [true, "Tag is required."],
      enum: [
        "building",
        "carbon",
        "energy",
        "food",
        "greentech",
        "investment",
        "nature-based",
        "refi",
        "transport",
        "reform",
        "other",
      ],
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    favoriteStartups: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);
// indexes for optimization
userSchema.index({ email: 1 });
module.exports = model("User", userSchema);