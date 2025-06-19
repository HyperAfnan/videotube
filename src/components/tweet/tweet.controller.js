import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as tweetService from "./tweet.service.js";
import { logger } from "../../utils/logger/index.js";
const tweetLogger = logger.child({ module: "tweet.controllers" });

const createTweet = asyncHandler(async (req, res) => {
	const { content, title } = req.body;
	const contentImage = req?.file?.path || null;

	tweetLogger.info("Creating tweet", { userId: req.user._id, title, hasImage: !!contentImage });

	const tweet = await tweetService.createTweet(
		content,
		title,
		req.user._id,
		contentImage,
	);

	tweetLogger.info("Tweet created successfully", { tweetId: tweet._id, userId: req.user._id });

	return res
		.status(201)
		.json(new ApiResponse(201, tweet, "Successfully created tweet"));
});

const updateTweet = asyncHandler(async (req, res) => {
	const { tweetId } = req.params;
	const { content, title } = req.body;

	tweetLogger.info("Updating tweet", { tweetId, userId: req.user._id });

	const tweet = await tweetService.findTweetById(tweetId);
	if (!tweet) {
		throw new ApiError(404, "Tweet not found", { tweetId });
	}

	const isOwner = await tweetService.isTweetOwner(tweetId, req.user._id);
	if (!isOwner) {
		throw new ApiError(402, "Unauthorized to perform this task", { tweetId });
	}

	const updatedTweet = await tweetService.updateTweet(content, title, tweetId);

	tweetLogger.info("Tweet updated successfully", { tweetId, userId: req.user._id });

	return res
		.status(200)
		.json(new ApiResponse(200, updatedTweet, "Successfully updated tweet"));
});

const deleteTweet = asyncHandler(async (req, res) => {
	const { tweetId } = req.params;

	tweetLogger.info("Deleting tweet", { tweetId, userId: req.user._id });

	const tweet = await tweetService.findTweetById(tweetId);
	if (!tweet) {
		throw new ApiError(404, "Tweet not found", { tweetId });
	}

	const isOwner = await tweetService.isTweetOwner(tweetId, req.user._id);
	if (!isOwner) {
		throw new ApiError(402, "Unauthorized to perform this task", { tweetId });
	}

	await tweetService.deleteTweet(tweetId);

	tweetLogger.info("Tweet deleted successfully", { tweetId, userId: req.user._id });

	return res.status(204).end();
});

const getUserTweets = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	tweetLogger.info("Fetching tweets for user", { userId });

	const user = await tweetService.findUserById(userId);
	if (!user) {
		throw new ApiError(404, "User not found");
	}

	const tweets = await tweetService.getUserTweets(user._id);

	tweetLogger.info("Fetched user tweets successfully", { userId, tweetCount: tweets.length });

	return res
		.status(200)
		.json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

export { createTweet, updateTweet, deleteTweet, getUserTweets };
