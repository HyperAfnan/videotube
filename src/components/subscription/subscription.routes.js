import { Router } from "express";
import {
	getSubscribedChannels,
	getUserChannelSubscribers,
	toggleSubscription,
} from "./subscription.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import {
	channelValidator,
	checkSelfSubscription,
	getSubscribedChannelsValidator,
	getUserChannelSubscribersValidator,
	toggleSubscriptionValidator,
} from "./subscription.validator.js";
import { validator } from "../../middlewares/validator.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: API endpoints for managing channel subscriptions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       required:
 *         - subscriber
 *         - channel
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the subscription
 *         subscriber:
 *           type: string
 *           description: User ID who subscribed to the channel
 *         channel:
 *           type: string
 *           description: User ID of the channel being subscribed to
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

/**
 * @swagger
 * /subscriptions/c/{channelId}:
 *   get:
 *     summary: Get channel subscribers
 *     tags: [Subscriptions]
 *     description: Retrieve all subscribers of a specific channel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the channel to get subscribers for
 *     responses:
 *       200:
 *         description: List of subscribers retrieved successfully
 *       404:
 *         description: Channel not found
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Toggle subscription
 *     tags: [Subscriptions]
 *     description: Subscribe or unsubscribe from a channel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channelId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the channel to subscribe/unsubscribe
 *     responses:
 *       200:
 *         description: Subscription toggled successfully
 *       400:
 *         description: Cannot subscribe to your own channel
 *       404:
 *         description: Channel not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/c/:channelId")
	.get(
		channelValidator,
		getUserChannelSubscribersValidator,
		validator,
		getUserChannelSubscribers,
	)
	.post(
		checkSelfSubscription,
		toggleSubscriptionValidator,
		validator,
		toggleSubscription,
	);

/**
 * @swagger
 * /subscriptions/u/{subscriberId}:
 *   get:
 *     summary: Get subscribed channels
 *     tags: [Subscriptions]
 *     description: Retrieve all channels that a user is subscribed to
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subscriberId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to get subscribed channels for
 *     responses:
 *       200:
 *         description: List of subscribed channels retrieved successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router
	.route("/u/:subscriberId")
	.get(
		channelValidator,
		getSubscribedChannelsValidator,
		validator,
		getSubscribedChannels,
	);

export default router;
