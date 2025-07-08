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

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You cannot delete this account."));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("Account Deleted Successfully!!!");
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("Signed out successfully!");
  } catch (error) {
    next(error);
  }
};

export const getusers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to see all users."));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};
