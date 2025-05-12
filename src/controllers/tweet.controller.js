import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
	//TODO: create tweet

	// get content from req.body
	// validate content, if it is present or not
	// create a tweet with Tweet.create()
	// return tweet details

	const { content } = req.body;

	if (!content) {
		throw new ApiError(404, "Tweet content not found");
	}

	const tweet = await Tweet.create({
		content: content,
		owner: req.user,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, tweet, "Successfully create tweet"));
});

const getUserTweets = asyncHandler(async (req, res) => {
	// TODO: get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
	//TODO: update tweet

	const { tweetId } = req.params;
	const { content } = req.body;

	const tweet = await Tweet.findByIdAndUpdate(
		new mongoose.Types.ObjectId(tweetId),
		{ $set: { content: content } },
		{ new: true }
	);

	if (!tweet) {
		throw new ApiError(404, "Tweet not found");
	}

	res
		.status(200)
		.json(new ApiResponse(200, tweet, "Successfully updated tweet"));
});

const deleteTweet = asyncHandler(async (req, res) => {
	//TODO: delete tweet

	const { tweetId } = req.params;
	const tweet = await Tweet.findByIdAndDelete(
		new mongoose.Types.ObjectId(tweetId)
	);

	if (!tweet) {
		throw new ApiError(404, "Tweet not found");
	}

	res.status(200).json(new ApiResponse(200, {}, "Successfully updated tweet"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
