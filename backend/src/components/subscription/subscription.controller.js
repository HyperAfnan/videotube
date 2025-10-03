import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as SubscriptionService from "./subscription.service.js";
import { logger } from "../../utils/logger/index.js";
const subscriptionLogger = logger.child({ module: "subscription.controller" });

const toggleSubscription = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { channelId } = req.params;

	subscriptionLogger.info(`[Request] ${requestId} Toggling subscription`, {
		userId: req.user._id,
		channelId,
	});

	const channel = await SubscriptionService.findChannelById(channelId);
	if (!channel)
		throw new ApiError(404, "Channel not found when toggling subscription", {
			channelId,
			requestId,
		});

	const selfSubscription = await SubscriptionService.selfSubscriptionCheck(
		req.user._id,
		channelId,
	);
	if (selfSubscription)
		throw new ApiError(400, "You can not subscribe to yourself", {
			channelId,
			requestId,
		});

	const subscription = await SubscriptionService.toggleSubscription(
		channelId,
		req.user._id,
	);

	subscriptionLogger.info(`[Request] ${requestId} Subscription toggled`, {
		userId: req.user._id,
		channelId,
		status: subscription.status,
	});

	if (subscription.status === "Subscribed") {
		subscriptionLogger.info(
			`[Request] ${requestId} User subscribed to channel`,
			{
				userId: req.user._id,
				channelId,
			},
		);
		return res
			.status(201)
			.json(new ApiResponse(201, subscription.data, "Subscribed!!"));
	} else {
		subscriptionLogger.info(
			`[Request] ${requestId} User unsubscribed from channel`,
			{
				userId: req.user._id,
				channelId,
			},
		);
		return res.status(204).end();
	}
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { channelId } = req.params;

	subscriptionLogger.info(
		`[Request] ${requestId} Fetching subscribers for channel`,
		{
			channelId,
			userId: req.user._id,
		},
	);

	const isValidChannel = await SubscriptionService.findChannelById(channelId);
	if (!isValidChannel) {
		throw new ApiError(404, "Channel not found when fetching subscribers", {
			channelId,
			requestId,
		});
	}

	const channel = channelId || req.user._id;
	const subscribers =
		await SubscriptionService.getUserChannelSubscribers(channel);

	subscriptionLogger.info(
		`[Request] ${requestId} Fetched channel subscribers`,
		{
			channelId,
			userId: req.user._id,
			count: Array.isArray(subscribers) ? subscribers.length : null,
		},
	);

	return res
		.status(200)
		.json(
			new ApiResponse(200, subscribers, "Successfully fetched subscribers"),
		);
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { subscriberId } = req.params;

	subscriptionLogger.info(
		`[Request] ${requestId} Fetching subscriptions for subscriber`,
		{
			subscriberId,
			userId: req.user._id,
		},
	);

	const isValidSubscriber =
		await SubscriptionService.findChannelById(subscriberId);
	if (!isValidSubscriber)
		throw new ApiError(
			404,
			"Subscriber not found when fetching subscriptions",
			{ subscriberId, requestId },
		);

	const subscriber = subscriberId || req.user._id;
	const subscriptions =
		await SubscriptionService.getSubscribedChannels(subscriber);

	subscriptionLogger.info(
		`[Request] ${requestId} Fetched subscriptions for subscriber`,
		{
			subscriberId: subscriber,
			userId: req.user._id,
			count: Array.isArray(subscriptions) ? subscriptions.length : null,
		},
	);

	return res
		.status(200)
		.json(
			new ApiResponse(200, subscriptions, "Successfully fetched subscriptions"),
		);
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
