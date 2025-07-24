import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  deletepost,
  getAllTags,
  getposts,
  updatepost,
} from "../controllers/post.controller.js";
import { fetchCurrentUser } from "../utils/fetchCurrentUser.js";

const router = express.Router();

router.post("/create", verifyToken, fetchCurrentUser, create);
router.get("/getposts", getposts);
router.delete(
  "/deletepost/:postId/:userId",
  verifyToken,
  fetchCurrentUser,
  deletepost
);
router.put(
  "/updatepost/:postId/:userId",
  verifyToken,
  fetchCurrentUser,
  updatepost
);
router.get("/tags", getAllTags);

export default router;
