import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId, parentCommentId = null } = req.body;

    if (userId !== req.user.id) {
      return res.status(403).json(403, "Unauthorized to create comment");
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
      parentCommentId,
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const allComments = await Comment.find({
      postId: req.params.postId,
    }).sort({ createdAt: -1 });

    const commentsByParent = {};
    allComments.forEach((comment) => {
      const parentId = comment.parentCommentId || "root";
      if (!commentsByParent[parentId]) {
        commentsByParent[parentId] = [];
      }
      commentsByParent[parentId].push(comment);
    });

    res.status(200).json(commentsByParent);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(403, "Comment not found"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(403, "Comment not found"));
    }

    if (comment.userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to edit."));
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error.message);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(403, "Comment Not Found!"));
    }

    if (comment.userId !== req.user.id && !req.user.isSuperAdmin) {
      return next(errorHandler(403, "You cannot delete this comment!"));
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment deleted successfully!");
  } catch (error) {
    next(error.message);
  }
};

export const getComments = async (req, res, next) => {
  if (!req.user.isSuperAdmin) {
    return next(
      errorHandler(403, "You are not authorized to view all comments")
    );
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sortDirection === "desc" ? 1 : -1;

    const comments = await Comment.find({})
      .populate("postId", "title slug") // populate postId with its title
      .populate("userId", "username profilePicture") // populate userId with its name and email
      .lean()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments({});
    const email = req.user.email;
    const now = new Date();
    const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      comments,
      email,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {
    next(error);
  }
};
