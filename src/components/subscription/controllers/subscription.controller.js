import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../../user/models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../../../utils/apiErrors.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
	const { channelId } = req.params;

	// get channelId from params
	// get userId from req.user._id
	// validate both ids
	// check if already subscribed, if subscribed
	// delete existing subscription with both ids
	//          or
	// create new subscription with both ids
	// return the subscription object

	if (!channelId) throw new ApiError(403, "Channel not found");

	if (!isValidObjectId(channelId))
		throw new ApiError(400, "Invalid Channel Id");

	const channel = await User.findById(channelId);
	if (!channel) throw new ApiError(404, "channel not found");

	if (channelId === req.user._id.toString())
		throw new ApiError(400, "You cannot subscribe to your own channel");

	const isSubscribed = await Subscription.find({
		channel: channelId,
		subscriber: req.user._id,
	});

	if (isSubscribed.length > 0) {
		await Subscription.deleteOne({
			channel: channelId,
			subscriber: req.user._id,
		});
		return res.status(204).send();
	} else {
		const subscription = await Subscription.create({
			channel: channelId,
			subscriber: req.user._id,
		});
		return res
			.status(201)
			.json(new ApiResponse(201, subscription, "Successfully subscribed"));
	}
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
	const { channelId } = req.params;
	if (!channelId) throw new ApiError(404, "Channel not found");

	if (!isValidObjectId(channelId))
		throw new ApiError(400, "Invalid Channel Id");

	const channel = await User.findById(channelId);
	if (!channel) throw new ApiError(404, "Channel not found");

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

	return res
		.status(200)
		.json(
			new ApiResponse(200, subscribers, "Successfully fetched subscribers")
		);
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
	const { subscriberId } = req.params;
	if (!subscriberId) throw new ApiError(404, "Channel not found");

	if (!isValidObjectId(subscriberId))
		throw new ApiError(400, "Invalid Channel Id");

	const subscriber = await User.findById(subscriberId);
	if (!subscriber) throw new ApiError(404, "Channel not found");

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

	return res
		.status(200)
		.json(
			new ApiResponse(200, subscriptions, "Successfully fetched subscriptions")
		);
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
