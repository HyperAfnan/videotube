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

	if (!channelId) {
		throw new ApiError(404, "Channel not found");
	}

	const isValidChannel = isValidObjectId(channelId);
	if (!isValidChannel) {
		throw new ApiError(400, "Invalid Channel Id");
	}

	const isSubscribed = await Subscription.find({
		channel: channelId,
		subscriber: req.user._id,
	});

	var subscription;
	if (isSubscribed.length > 0) {
		subscription = await Subscription.deleteOne({
			channel: channelId,
			subscriber: req.user._id,
		});
		res
			.status(200)
			.json(new ApiResponse(200, subscription, "Successfully unsubscribed"));
	} else {
		subscription = await Subscription.create({
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
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
	const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
