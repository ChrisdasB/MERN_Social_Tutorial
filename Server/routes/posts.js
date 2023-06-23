import express from "express";
import {createPost, getFeedPosts, getUserPosts, likePost} from "../controllers/post.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// READ
// route is "/posts/..."
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);


// PATCh method is used to only update certain, given atributes of a ressource
router.patch("/:id/like", verifyToken, likePost);

export default router;