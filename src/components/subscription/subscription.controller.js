import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as SubscriptionService from "./subscription.service.js";
import { logger } from "../../utils/logger/index.js";
const subscriptionLogger = logger.child({ module: "subscription.controller" });

// TODO: check if user is verified or not
const toggleSubscription = asyncHandler(async (req, res) => {
	const { channelId } = req.params;

	subscriptionLogger.info("Toggling subscription", {
		userId: req.user._id,
		channelId,
	});

	const channel = await SubscriptionService.findChannelById(channelId);
	if (!channel)
		throw new ApiError(404, "Channel not found when toggling subscription", {
			channelId,
		});

	const selfSubscription = await SubscriptionService.selfSubscriptionCheck(
		req.user._id,
		channelId,
	);
	if (selfSubscription)
		throw new ApiError(400, "You can not subscribe to yourself", { channelId });

	const subscription = await SubscriptionService.toggleSubscription(
		channelId,
		req.user._id,
	);

	subscriptionLogger.info("Subscription toggled", {
		userId: req.user._id,
		channelId,
		status: subscription.status,
	});

	if (subscription.status === "Subscribed") {
		subscriptionLogger.info("User subscribed to channel", {
			userId: req.user._id,
			channelId,
		});
		return res
			.status(201)
			.json(new ApiResponse(201, subscription.data, "Subscribed!!"));
	} else {
		subscriptionLogger.info("User unsubscribed from channel", {
			userId: req.user._id,
			channelId,
		});
		return res.status(204).end();
	}
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
	const { channelId } = req.params;

	subscriptionLogger.info("Fetching subscribers for channel", {
		channelId,
		userId: req.user._id,
	});

	const isValidChannel = await SubscriptionService.findChannelById(channelId);
	if (!isValidChannel) {
		throw new ApiError(404, "Channel not found when fetching subscribers", {
			channelId,
		});
	}

	const channel = channelId || req.user._id;
	const subscribers =
		await SubscriptionService.getUserChannelSubscribers(channel);

	subscriptionLogger.info("Fetched channel subscribers", {
		channelId,
		userId: req.user._id,
		count: Array.isArray(subscribers) ? subscribers.length : undefined,
	});

	return res
		.status(200)
		.json(
			new ApiResponse(200, subscribers, "Successfully fetched subscribers"),
		);
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
	const { subscriberId } = req.params;

	subscriptionLogger.info("Fetching subscriptions for subscriber", {
		subscriberId,
		userId: req.user._id,
	});

	const isValidSubscriber =
		await SubscriptionService.findChannelById(subscriberId);
	if (!isValidSubscriber)
		throw new ApiError(
			404,
			"Subscriber not found when fetching subscriptions",
			{ subscriberId },
		);

	const subscriber = subscriberId || req.user._id;
	const subscriptions =
		await SubscriptionService.getSubscriberChannels(subscriber);

	subscriptionLogger.info("Fetched subscriptions for subscriber", {
		subscriberId: subscriber,
		userId: req.user._id,
		count: Array.isArray(subscriptions) ? subscriptions.length : undefined,
	});

	return res
		.status(200)
		.json(
			new ApiResponse(200, subscriptions, "Successfully fetched subscriptions"),
		);
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
