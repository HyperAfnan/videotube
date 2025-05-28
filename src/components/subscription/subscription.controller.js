import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as SubscriptionService from "./subscription.service.js";

const toggleSubscription = asyncHandler(async (req, res) => {
	const { channelId } = req.params;

	const subscription = await SubscriptionService.toggleSubscription(
		channelId,
		req.user._id
	);
	if (subscription.status === "Subscribed") {
		return res
			.status(201)
			.json(new ApiResponse(201, subscription.data, "Subscribed!!"));
	} else return res.status(204).end();
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
	const { channelId } = req.params;
	const channel = channelId || req.user._id;
	const subscribers =
		await SubscriptionService.getUserChannelSubscribers(channel);

	return res
		.status(200)
		.json(
			new ApiResponse(200, subscribers, "Successfully fetched subscribers")
		);
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
	const { subscriberId } = req.params;
	const subscriber = subscriberId || req.user._id;
	const subscriptions =
		await SubscriptionService.getSubscriberChannels(subscriber);

	return res
		.status(200)
		.json(
			new ApiResponse(200, subscriptions, "Successfully fetched subscriptions")
		);
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
