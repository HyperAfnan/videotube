import { Router } from "express";
import {
	addComment,
	getComments,
	updateComment,
	deleteComment,
} from "../controllers/comments.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:id").get(getComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
