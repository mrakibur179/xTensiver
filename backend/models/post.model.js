import mongoose from "mongoose";

function arrayLimit(val) {
  return val.length > 0;
}

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      default:
        "https://media.sproutsocial.com/uploads/2022/05/How-to-post-on-instagram-from-pc.jpg",
    },
    tags: {
      type: [String],
      required: true,
      validate: [arrayLimit, "{PATH} must have at least one tag"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
