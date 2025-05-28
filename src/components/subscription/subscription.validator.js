import { param } from "express-validator";
import { User } from "../user/user.models.js";
import { ApiError } from "../../utils/apiErrors.js";

export const checkSelfSubscription = async (req, _, next) => {
	if (req.params.channelId === req.user._id.toString())
		throw new ApiError(400, "You cannot subscribe to your own channel");
	next();
};

export const channelValidator = async (req, _, next) => {
	const channel = await User.findById(req.params.channelId);
	if (!channel) throw new ApiError(404, "Channel not found");
	next();
};

export const toggleSubscriptionValidator = [
	param("channelId")
		.isEmpty()
		.withMessage("channelId is required")
		.isString()
		.withMessage("channelId must be string")
		.isMongoId()
		.withMessage("Invalid channelId"),
];

export const getUserChannelSubscribersValidator = [
	param("channelId")
		.isEmpty()
		.withMessage("channelId is required")
		.isString()
		.withMessage("channelId must be string")
		.isMongoId()
		.withMessage("Invalid channelId"),
];

export const getSubscribedChannelsValidator = [
	param("subscriberId")
		.isEmpty()
		.withMessage("subscriberId is required")
		.isString()
		.withMessage("subscriberId must be string")
		.isMongoId()
		.withMessage("Invalid subscriberId"),
];
