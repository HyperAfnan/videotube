import { body, param, oneOf } from "express-validator";
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
		.notEmpty()
		.withMessage("Title is requied")
		.isString()
		.withMessage("Title must be string")
		.trim(),
	body("content")
		.notEmpty()
		.withMessage("content is requied")
		.isString()
		.withMessage("Title must be string")
		.trim(),
];

export const createTweetFileValidator = async (req, _, next) => {
	console.log(req.body.title);
	const file = req?.file?.path;
	const supportedFileTypes = ["png", "jpg", "jpeg", "gif"];
	if (file) {
		for (let i = 0; i < supportedFileTypes.length; i++) {
			const supportedFile = supportedFileTypes[i];
			if (file.split(".")[1] === supportedFile) return next();
		}
		throw new ApiError(400, `Unsupported file type: ${file.split(".")[1]}`);
	}
};

export const updateTweetValidator = [
	oneOf(
		[
			body("title")
				.optional()
				.isString()
				.withMessage("Title must be string")
				.trim(),
			body("content")
				.optional()
				.isString()
				.withMessage("Title must be string")
				.trim(),
		],
		{ message: "At least one field required" },
	),
	param("tweetId")
		.notEmpty()
		.withMessage("tweetId is requied")
		.isString()
		.withMessage("tweetId must be string")
		.isMongoId()
		.withMessage("Invalid tweetId"),
];

export const deleteTweetValidator = [
	param("tweetId")
		.notEmpty()
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
