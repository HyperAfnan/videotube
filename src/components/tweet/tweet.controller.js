import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as tweetService from "./tweet.service.js";

const createTweet = asyncHandler(async (req, res) => {
	const { content, title } = req.body;
	const contentImage = req?.file?.path || null;

	const tweet = await tweetService.createTweet(
		content,
		title,
		req.user._id,
		contentImage,
	);

	return res
		.status(201)
		.json(new ApiResponse(201, tweet, "Successfully create tweet"));
});

const updateTweet = asyncHandler(async (req, res) => {
	const { tweetId } = req.params;
	const { content, title } = req.body;

	const tweet = await tweetService.updateTweet(content, title, tweetId);
	return res
		.status(200)
		.json(new ApiResponse(200, tweet, "Successfully updated tweet"));
});

const deleteTweet = asyncHandler(async (req, res) => {
	const { tweetId } = req.params;
	await tweetService.deleteTweet(tweetId);
	return res.status(204).end();
});

const getUserTweets = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const user = userId || req.user.Id;
	const tweets = await tweetService.getUserTweets(user);

	return res
		.status(200)
		.json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

export { createTweet, updateTweet, deleteTweet, getUserTweets };
