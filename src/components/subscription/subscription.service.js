import mongoose from "mongoose";
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
	async (userId, channelId) => {
		return channelId === userId.toString();
	},
);

export const toggleSubscription = serviceHandler(
	async (channelId, subscriberId) => {
		subscriptionLogger.info("Toggling subscription", { channelId, subscriberId });

		const isSubscribed = await Subscription.find({
			channel: channelId,
			subscriber: subscriberId,
		});

		if (isSubscribed.length > 0) {
			await Subscription.deleteOne({
				channel: channelId,
				subscriber: subscriberId,
			});
			subscriptionLogger.info("Unsubscribed from channel", { channelId, subscriberId });
			return { status: "Unsubscribed" };
		} else {
			const subscription = await Subscription.create({
				channel: channelId,
				subscriber: subscriberId,
			});
			subscriptionLogger.info("Subscribed to channel", { channelId, subscriberId, subscriptionId: subscription._id });
			return { status: "Subscribed", data: subscription };
		}
	},
);

// TODO: return only array of subscribers rather than full user objects
export const getUserChannelSubscribers = serviceHandler(async (channelId) => {
	subscriptionLogger.info("Fetching subscribers for channel", { channelId });
	const subscribers = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(String(channelId)) } },
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "channel",
				as: "subscribers",
			},
		},
		{ $project: { username: 1, subscribers: 1, _id: 0 } },
	]);
	subscriptionLogger.info("Fetched channel subscribers", { channelId, count: Array.isArray(subscribers) ? subscribers.length : undefined });
	return subscribers;
});

export const getSubscriberChannels = serviceHandler(async (subscriberId) => {
	subscriptionLogger.info("Fetching subscriptions for subscriber", { subscriberId });
	const subscriptions = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(String(subscriberId)) } },
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "subscriber",
				as: "subscriptions",
			},
		},
		{ $project: { username: 1, subscriptions: 1, _id: 0 } },
	]);
	subscriptionLogger.info("Fetched subscriptions for subscriber", { subscriberId, count: Array.isArray(subscriptions) ? subscriptions.length : undefined });
	return subscriptions;
});
