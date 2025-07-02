import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const test = (req, res) => {
  res.json({ message: "Working" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not eligible to update information.")
    );
  }

  try {
    const updateData = {};

    // Handle password update
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(
          errorHandler(400, "Password must be at least 6 characters.")
        );
      }
      updateData.password = bcrypt.hashSync(req.body.password, 10);
    }

    // Handle username update
    if (req.body.username) {
      if (req.body.username.length < 6 || req.body.username.length > 20) {
        return next(
          errorHandler(400, "Username must be between 6 and 20 characters.")
        );
      }
      if (req.body.username.includes(" ")) {
        return next(errorHandler(400, "Username should not contain spaces."));
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, "Username should be in lowercase."));
      }
      if (!/^[a-z0-9]+$/.test(req.body.username)) {
        return next(
          errorHandler(400, "Username should not contain special characters.")
        );
      }

      updateData.username = req.body.username;
    }

    // Optional fields
    if (req.body.email) {
      updateData.email = req.body.email;
    }
    if (req.body.profilePicture) {
      updateData.profilePicture = req.body.profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateData },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
