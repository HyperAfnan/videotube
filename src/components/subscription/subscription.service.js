import { serviceHandler } from "../../utils/handlers.js";
import { Subscription } from "./subscription.models.js";

export const toggleSubscription = serviceHandler(
	async (channelId, subscriberId) => {
		const isSubscribed = await Subscription.find({
			channel: channelId,
			subscriber: subscriberId,
		});

		if (isSubscribed.length > 0) {
			await Subscription.deleteOne({
				channel: channelId,
				subscriber: req.user._id,
			});
			return { status: "Unsubscriber" };
		} else {
			const subscription = await Subscription.create({
				channel: channelId,
				subscriber: req.user._id,
			});
			return { status: "Subscribed", data: subscription };
		}
	}
);

export const getUserChannelSubscribers = serviceHandler(async (channelId) => {
	const subscribers = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(channelId) } },
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

	return subscribers;
});

export const getSubscriberChannels = serviceHandler(async (subscriberId) => {
	const subscriptions = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(subscriberId) } },
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

	return subscriptions;
});
