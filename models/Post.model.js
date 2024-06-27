//server/models/Post.model.js
const { Schema, model } = require("mongoose");
const postSchema = new Schema(
  {
    imgUrl: String,
    title: {
      type: String,
      required: [true, "Title is required."],
      maxlength: [200, "Title cannot exceed 200 characters."],
    },
    tags: {
      type: [String],
      required: [true, "Tag is required."],
      enum: [
        "Building",
        "Carbon",
        "Energy",
        "Food",
        "Greentech",
        "Investment",
        "ReFi",
        "Transport",
        "Reform",
      ],
    },
    content: {
      type: String,
      required: [true, "Content is required."],
      maxlength: [3000, "Content cannot exceed 3000 characters."],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// Adding indexes for optimization
postSchema.index({ tags: 1 });
postSchema.index({ user: 1 });

module.exports = model("Post", postSchema);
