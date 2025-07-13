import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.currentUser.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post."));
  }

  const { title, content, description, tags } = req.body;

  if (!title || !content || !tags || !tags.length || !description) {
    return next(errorHandler(400, "Please provide all the information."));
  }

  const wordCount = title.trim().split(/\s+/).length;
  if (wordCount > 12) {
    return next(errorHandler(400, "Title must not exceed 10 words."));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate("userId", "username");

    const totalPost = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPost,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    // ✅ Only author (admin) or superadmin can delete
    const isAuthor = post.userId.toString() === req.user.id;
    const isSuperAdmin = req.user.isSuperAdmin;

    if (!isAuthor && !isSuperAdmin) {
      return next(
        errorHandler(403, "You are not authorized to delete this post.")
      );
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted.");
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  const { title, content, description, tags } = req.body;

  if (!title || !content || !tags || !tags.length || !description) {
    return next(errorHandler(400, "Please provide all the information."));
  }

  const wordCount = title.trim().split(/\s+/).length;
  if (wordCount > 12) {
    return next(errorHandler(400, "Title must not exceed 10 words."));
  }

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(errorHandler(404, "Post not found"));

    // ✅ Only allow if current user is:
    // - The author AND an admin
    // - OR a super admin
    if (
      post.userId.toString() !== req.user.id &&
      !req.currentUser.isSuperAdmin
    ) {
      return next(errorHandler(403, "You cannot update this post"));
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title,
          description,
          content,
          tags,
          poster: req.body.poster,
          slug: title
            .split(" ")
            .join("-")
            .toLowerCase()
            .replace(/[^a-zA-Z0-9-]/g, "-"),
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
