import { body, param } from "express-validator";
import { Tweet } from "./tweet.models.js";
import { ApiError } from "../../utils/apiErrors.js";
import { User } from "../user/user.models.js";

export const validateOwner = async (req, _, next) => {
	const tweet = await Tweet.findById(req.params.tweetId);
	if (!tweet) throw new ApiError(400, "Tweet not found");
	if (tweet.owner.toString() !== req.user._id.toString())
		throw new ApiError(402, "Unauthorized to update tweet");
	next();
};

export const createTweetValidator = [
	body("title")
		.isEmpty()
		.withMessage("Title is requied")
		.isString()
		.withMessage("Title must be string")
		.trim(),
	body("content")
		.isEmpty()
		.withMessage("content is requied")
		.isString()
		.withMessage("Title must be string")
		.trim(),
];

export const updateTweetValidator = [
	body("").custom((request) => {
		if (request.title && request.content)
			throw new ApiError(400, "Either title or content is required");
		return true;
	}),
	body("title")
		.isEmpty()
		.withMessage("Title is requied")
		.isString()
		.withMessage("Title must be string")
		.trim(),
	body("content")
		.isEmpty()
		.withMessage("content is requied")
		.isString()
		.withMessage("Title must be string")
		.trim(),
	param("tweetId")
		.isEmpty()
		.withMessage("tweetId is requied")
		.isString()
		.withMessage("tweetId must be string")
		.isMongoId()
		.withMessage("Invalid tweetId"),
];

export const deleteTweetValidator = [
	param("tweetId")
		.isEmpty()
		.withMessage("tweetId is requied")
		.isString()
		.withMessage("tweetId must be string")
		.isMongoId()
		.withMessage("Invalid tweetId"),
];

export const getUserTweetsValidator = [
	param("userId")
		.optional()
		.isString()
		.withMessage("tweetId must be string")
		.isMongoId()
		.withMessage("Invalid tweetId")
		.custom(async (userId) => {
			const user = await User.findById(userId);
			if (!user) throw new ApiError(400, "User not found");
			return true;
		}),
];
