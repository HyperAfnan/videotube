import { Router } from "express";
import {
	// getUser,
	getUserChannelProfile,
	getUserWatchHistory,
	updateAccountDetails,
	updateUserAvatar,
	updateUserCoverImg,
} from "./user.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyAccessToken as auth} from "../../middlewares/auth.middleware.js";
import watchLaterRoutes from "../watchLater/watchLater.router.js";
import { validator } from "../../middlewares/validator.middleware.js";
import {
	avatarFileValidator,
	coverImageFileValidator,
	getUserChannelProfileValidator,
	updateAccountDetailsValidator,
} from "./user.validator.js";
import { defaultRateLimiter } from "../../middlewares/rateLimiter.middleware.js";

const router = Router();

router.use(defaultRateLimiter);
router.use("/watchlater", watchLaterRoutes);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for user management
 */

/**
 * @swagger
 * /user/updateDetails:
 *   patch:
 *     summary: Update user details
 *     tags: [Users]
 *     description: Update user account details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 description: User's new full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's new email
 *     responses:
 *       200:
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid details provided
 *       401:
 *         description: Unauthorized
 */
router
	.route("/updateDetails")
	.patch(
		defaultRateLimiter,
		auth,
		updateAccountDetailsValidator,
		validator,
		updateAccountDetails,
	);

/**
 * @swagger
 * /user/updateAvatar:
 *   patch:
 *     summary: Update user avatar
 *     tags: [Users]
 *     description: Update user's profile picture
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: User's new profile picture
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 *                   description: URL of the updated avatar
 *       400:
 *         description: Invalid image format
 *       401:
 *         description: Unauthorized
 */
router
	.route("/updateAvatar")
	.patch(
		defaultRateLimiter,
		auth,
		upload.single("avatar"),
		avatarFileValidator,
		updateUserAvatar,
	);

/**
 * @swagger
 * /user/updateCoverImage:
 *   patch:
 *     summary: Update user cover image
 *     tags: [Users]
 *     description: Update user's profile cover image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - coverImage
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: User's new cover image
 *     responses:
 *       200:
 *         description: Cover image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 coverImage:
 *                   type: string
 *                   description: URL of the updated cover image
 *       400:
 *         description: Invalid image format
 *       401:
 *         description: Unauthorized
 */
router
	.route("/updateCoverImage")
	.patch(
		defaultRateLimiter,
		auth,
		upload.single("coverImage"),
		coverImageFileValidator,
		updateUserCoverImg,
	);

/**
 * @swagger
 * /user/history:
 *   get:
 *     summary: Get user watch history
 *     tags: [Users]
 *     description: Retrieve the user's video watch history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Watch history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Video'
 *       401:
 *         description: Unauthorized
 */
router.route("/history").get(defaultRateLimiter, auth, getUserWatchHistory);

/**
 * @swagger
 * /user/ch/{username}:
 *   get:
 *     summary: Get user channel profile
 *     tags: [Users]
 *     description: Retrieve a user's channel profile by username
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: The username of the channel
 *     responses:
 *       200:
 *         description: Channel profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 fullname:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 coverImage:
 *                   type: string
 *                 subscribersCount:
 *                   type: number
 *                 isSubscribed:
 *                   type: boolean
 *       404:
 *         description: Channel not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/ch/:username")
	.get(
		defaultRateLimiter,
		auth,
		getUserChannelProfileValidator,
		validator,
		getUserChannelProfile,
	);

export default router;
