import { Router } from "express";
import {
	updateComment,
	deleteComment,
   addTweetComment,
   addVideoComment,
   getTweetComments,
   getVideoComments,
} from "../controllers/comments.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/v/:id").get(getVideoComments).post(addVideoComment);
router.route("/t/:id").get(getTweetComments).post(addTweetComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
