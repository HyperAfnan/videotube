import { Router } from "express";
import { getChannelStats, getChannelVideos } from "./dashboard.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { defaultRateLimiter } from "../../middlewares/rateLimiter.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API endpoints for user dashboard
 */

router.use(defaultRateLimiter)
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get channel statistics
 *     tags: [Dashboard]
 *     description: Retrieve statistics for the current user's channel
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Channel statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalVideos:
 *                   type: integer
 *                   description: Total number of videos uploaded
 *                 totalViews:
 *                   type: integer
 *                   description: Total number of views across all videos
 *                 totalSubscribers:
 *                   type: integer
 *                   description: Total number of channel subscribers
 *                 totalLikes:
 *                   type: integer
 *                   description: Total number of likes across all videos
 *       401:
 *         description: Unauthorized
 */
router.route("/stats").get(getChannelStats);

/**
 * @swagger
 * /dashboard/videos:
 *   get:
 *     summary: Get channel videos
 *     tags: [Dashboard]
 *     description: Retrieve all videos uploaded by the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Channel videos retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.route("/videos").get(getChannelVideos);

export default router;
