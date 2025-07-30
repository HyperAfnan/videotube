import { ObjectId } from "mongodb";
import { serviceHandler } from "../../utils/handlers.js";
import { User } from "../user/user.model.js";
import { Subscription } from "./subscription.model.js";
import { logger } from "../../utils/logger/index.js";
const subscriptionLogger = logger.child({ module: "subscription.service" });

export const findChannelById = serviceHandler(async (channelId) => {
	const channel = await User.findById(channelId);
	return channel;
});

export const selfSubscriptionCheck = serviceHandler(
	async (userId, channelId) => channelId === userId.toString(),
);

export const toggleSubscription = serviceHandler(
	async (channelId, subscriberId) => {
		subscriptionLogger.info("Toggling subscription", {
			channelId,
			subscriberId,
		});

		const isSubscribed = await Subscription.find({
			channel: channelId,
			subscriber: subscriberId,
		});

		if (isSubscribed.length > 0) {
			await Subscription.deleteOne({
				channel: channelId,
				subscriber: subscriberId,
			});
			subscriptionLogger.info("Unsubscribed from channel", {
				channelId,
				subscriberId,
			});
			return { status: "Unsubscribed" };
		} else {
			const subscription = await Subscription.create({
				channel: channelId,
				subscriber: subscriberId,
			});
			subscriptionLogger.info("Subscribed to channel", {
				channelId,
				subscriberId,
				subscriptionId: subscription._id,
			});
			return { status: "Subscribed", data: subscription };
		}
	},
);

export const getUserChannelSubscribers = serviceHandler(async (channelId) => {
	subscriptionLogger.info("Fetching subscribers for channel", { channelId });
	const subscribers = await Subscription.aggregate([
		{ $match: { channel: new ObjectId(String(channelId)) } },
		{
			$lookup: {
				from: "users",
				localField: "subscriber",
				foreignField: "_id",
				as: "subscriberInfo",
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "channel",
				foreignField: "_id",
				as: "channelInfo",
				pipeline: [
					{ $project: { _id: 1, username: 1, avatar: 1, fullame: 1 } },
				],
			},
		},
		{
			$project: {
				_id: 0,
				channelInfo: { $arrayElemAt: ["$channelInfo", 0] },
				subscriber: { $arrayElemAt: ["$subscriberInfo", 0] },
			},
		},
		{ $group: { _id: "$channelInfo", subscribers: { $push: "$subscriber" } } },
		{ $project: { _id: 0, channelInfo: "$_id", subscribers: 1 } },
	]);

	subscriptionLogger.info("Fetched channel subscribers", {
		channelId,
		count: Array.isArray(subscribers) ? subscribers.length : null,
	});
	return subscribers;
});

export const getSubscribedChannels = serviceHandler(async (subscriberId) => {
	subscriptionLogger.info("Fetching subscriptions for user", {
		subscriberId,
	});
	const subscriptions = await Subscription.aggregate([
		{ $match: { subscriber: new ObjectId(String(subscriberId)) } },
		{
			$lookup: {
				from: "users",
				localField: "subscriber",
				foreignField: "_id",
				as: "userInfo",
				pipeline: [
					{ $project: { _id: 1, username: 1, avatar: 1, fullname: 1 } },
				],
			},
		},
		{
			$lookup: {
				from: "users",
				localField: "channel",
				foreignField: "_id",
				as: "subscription",
				pipeline: [
					{ $project: { _id: 1, username: 1, avatar: 1, fullname: 1 } },
				],
			},
		},
		{
			$project: {
				_id: 0,
				userInfo: { $arrayElemAt: ["$userInfo", 0] },
				subscription: { $arrayElemAt: ["$subscription", 0] },
			},
		},
		{ $group: { _id: "$userInfo", subscriptions: { $push: "$subscription" } } },
		{ $project: { _id: 0, userInfo: "$_id", subscriptions: 1 } },
	]);
	subscriptionLogger.info("Fetched subscriptions for user", {
		subscriberId,
		count: Array.isArray(subscriptions) ? subscriptions.length : null,
	});
	return subscriptions;
});
