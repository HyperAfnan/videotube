import { Router } from "express";
import {
	getLikedVideos,
	toggleCommentLike,
	toggleTweetLike,
	toggleVideoLike,
} from "./like.controller.js";
import { verifyAccessToken } from "../../middlewares/auth.middleware.js";
import { validator } from "../../middlewares/validator.middleware.js";
import {
	commentIdValidator,
	getLikedVideosValidator,
	toggleCommentLikeValidator,
	toggleTweetLikeValidator,
	toggleVideoLikeValidator,
	tweetIdValidator,
	userIdValidator,
	videoIdValidator,
} from "./like.validator.js";
import { defaultRateLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: API endpoints for managing likes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the like
 *         video:
 *           type: string
 *           description: ID of the liked video (if applicable)
 *         comment:
 *           type: string
 *           description: ID of the liked comment (if applicable)
 *         tweet:
 *           type: string
 *           description: ID of the liked tweet (if applicable)
 *         likedBy:
 *           type: string
 *           description: User ID of the person who created the like
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
 * /likes/toggle/v/{videoId}:
 *   post:
 *     summary: Toggle like on a video
 *     tags: [Likes]
 *     description: Toggle like status on a specific video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the video to toggle like
 *     responses:
 *       200:
 *         description: Video like status toggled successfully
 *       404:
 *         description: Video not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/toggle/v/:videoId")
	.post(toggleVideoLikeValidator, validator, videoIdValidator, toggleVideoLike);

/**
 * @swagger
 * /likes/toggle/c/{commentId}:
 *   post:
 *     summary: Toggle like on a comment
 *     tags: [Likes]
 *     description: Toggle like status on a specific comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the comment to toggle like
 *     responses:
 *       200:
 *         description: Comment like status toggled successfully
 *       404:
 *         description: Comment not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/toggle/c/:commentId")
	.post(
		toggleCommentLikeValidator,
		validator,
		commentIdValidator,
		toggleCommentLike,
	);

/**
 * @swagger
 * /likes/toggle/t/{tweetId}:
 *   post:
 *     summary: Toggle like on a tweet
 *     tags: [Likes]
 *     description: Toggle like status on a specific tweet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the tweet to toggle like
 *     responses:
 *       200:
 *         description: Tweet like status toggled successfully
 *       404:
 *         description: Tweet not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/toggle/t/:tweetId")
	.post(toggleTweetLikeValidator, validator, tweetIdValidator, toggleTweetLike);

/**
 * @swagger
 * /likes/videos:
 *   get:
 *     summary: Get liked videos
 *     tags: [Likes]
 *     description: Retrieve all videos liked by the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liked videos retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router
	.route("/videos/:userId")
	.get(getLikedVideosValidator, validator, userIdValidator, getLikedVideos);

export default router;
