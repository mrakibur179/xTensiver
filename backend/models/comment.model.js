import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
      ref: "Post", // Assuming you have a Post model
    },
    userId: {
      type: String,
      required: true,
      ref: "User", // Assuming you have a User model
    },
    parentCommentId: {
      type: String,
      default: null, // null = top-level comment
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
