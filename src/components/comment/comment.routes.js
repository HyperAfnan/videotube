import { Router } from "express";
import {
	addTweetComment,
	addVideoComment,
	deleteComment,
	getTweetComments,
	getVideoComments,
	updateComment,
} from "./comments.controller.js";
import { verifyAccessToken } from "../../middlewares/auth.middleware.js";
import { validator } from "../../middlewares/validator.middleware.js";
import {
	addTweetCommentValidator,
	addVideoCommentValidator,
	commentIdValidatorAndPermsCheck,
	deleteCommentValidator,
	getTweetCommentsValidator,
	getVideoCommentsValidator,
	tweetidValidator,
	tweetPermsChecker,
	updateCommentValidator,
	videoIdValidator,
	videoPermsChecker,
} from "./comment.validator.js";
import { defaultRateLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API endpoints for managing comments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the comment
 *         content:
 *           type: string
 *           description: Content of the comment
 *         owner:
 *           type: string
 *           description: User ID of the comment owner
 *         video:
 *           type: string
 *           description: Video ID if the comment is on a video
 *         tweet:
 *           type: string
 *           description: Tweet ID if the comment is on a tweet
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

router.use(defaultRateLimiter)
router.use(verifyAccessToken); // Apply verifyJWT middleware to all routes in this file

/**
 * @swagger
 * /comments/v/{id}:
 *   get:
 *     summary: Get all comments for a video
 *     tags: [Comments]
 *     description: Retrieve all comments associated with a specific video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID
 *     responses:
 *       200:
 *         description: List of comments retrieved successfully
 *       404:
 *         description: Video not found
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Add comment to a video
 *     tags: [Comments]
 *     description: Add a new comment to a specific video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Video ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Content of the comment
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Video not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/v/:id")
	.get(getVideoCommentsValidator, validator, videoIdValidator, getVideoComments)
	.post(
		addVideoCommentValidator,
		validator,
		videoPermsChecker,
		addVideoComment,
	);

/**
 * @swagger
 * /comments/t/{id}:
 *   get:
 *     summary: Get all comments for a tweet
 *     tags: [Comments]
 *     description: Retrieve all comments associated with a specific tweet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tweet ID
 *     responses:
 *       200:
 *         description: List of comments retrieved successfully
 *       404:
 *         description: Tweet not found
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Add comment to a tweet
 *     tags: [Comments]
 *     description: Add a new comment to a specific tweet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Tweet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: Content of the comment
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Tweet not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/t/:id")
	.get(getTweetCommentsValidator, validator, tweetidValidator, getTweetComments)
	.post(
		addTweetCommentValidator,
		validator,
		tweetPermsChecker,
		addTweetComment,
	);

/**
 * @swagger
 * /comments/c/{commentId}:
 *   patch:
 *     summary: Update a comment
 *     tags: [Comments]
 *     description: Update content of an existing comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: New content of the comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden - User doesn't own this comment
 *       404:
 *         description: Comment not found
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     description: Delete an existing comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Forbidden - User doesn't own this comment
 *       404:
 *         description: Comment not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/c/:commentId")
	.delete(
		deleteCommentValidator,
		validator,
		commentIdValidatorAndPermsCheck,
		deleteComment,
	)
	.patch(
		updateCommentValidator,
		validator,
		commentIdValidatorAndPermsCheck,
		updateComment,
	);

export default router;
