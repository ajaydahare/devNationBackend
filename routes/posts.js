import express from "express";
import {
  getPostsBySearch,
  getPosts,
  getPost,
  createPosts,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  getUserPosts
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/search", getPostsBySearch);
router.get("/:id", getPost);
router.get("/user/:id",getUserPosts)
router.post("/", auth, createPosts);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);
router.post("/:id/commentPost", auth, commentPost);

export default router;
