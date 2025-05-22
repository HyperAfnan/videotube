import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
	const { channelId } = req.params;
	// TODO: toggle subscription

	// get channelId from params
	// get userId from req.user._id
	// validate both ids
	// check if already subscribed, if subscribed
	// delete existing subscription with both ids
	//          or
	// create new subscription with both ids
	// return the subscription object

	if (!channelId) throw new ApiError(404, "Channel not found");

	if (!isValidObjectId(channelId))
		throw new ApiError(400, "Invalid Channel Id");

   if (channelId === req.user._id.toString()) 
      throw new ApiError(400, "You cannot subscribe to your own channel");

	const isSubscribed = await Subscription.find({
		channel: channelId,
		subscriber: req.user._id,
	});

	if (isSubscribed.length > 0) {
		const subscription = await Subscription.deleteOne({
			channel: channelId,
			subscriber: req.user._id,
		});
		res
			.status(200)
			.json(new ApiResponse(200, subscription, "Successfully unsubscribed"));
	} else {
		const subscription = await Subscription.create({
			channel: channelId,
			subscriber: req.user._id,
		});
		res
			.status(200)
			.json(new ApiResponse(200, subscription, "Successfully subscribed"));
	}
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
	const { channelId } = req.params;
	if (!channelId) throw new ApiError(404, "Channel not found");

	if (!isValidObjectId(channelId))
		throw new ApiError(400, "Invalid Channel Id");

	const subscribers = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(channelId) } },
		{ $lookup: { from: "subscriptions", localField: "_id", foreignField: "channel", as: "subscribers", }, },
		{ $project: { username: 1, subscribers: 1, _id: 0 } },
	]);

	res
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

	const subscriptions = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(subscriberId) } },
		{ $lookup: { from: "subscriptions", localField: "_id", foreignField: "subscriber", as: "subscriptions", }, },
		{ $project: { username: 1, subscriptions: 1, _id:0 } },
	]);

	res
		.status(200)
		.json(
			new ApiResponse(200, subscriptions, "Successfully fetched subscribers")
		);
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
