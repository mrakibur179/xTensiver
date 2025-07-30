import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const fetchCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return next(errorHandler(404, "User not found"));
    }
    req.currentUser = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};
