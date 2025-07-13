import Comment from "../models/comment.model.js";

export const createcomment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return res.status(403).json(403, "Unauthorized to create comment");
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};
