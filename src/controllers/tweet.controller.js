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

	const { content, title } = req.body;

	if (!content) throw new ApiError(404, "Tweet content not found");
	if (!title) throw new ApiError(404, "Tweet title not found");

	const tweet = await Tweet.create({ content, title, owner: req.user._id });

	return res
		.status(200)
		.json(new ApiResponse(200, tweet, "Successfully create tweet"));
});

const updateTweet = asyncHandler(async (req, res) => {
	//TODO: update tweet

	const { tweetId } = req.params;
	const { content, title } = req.body;

	if (!tweetId) throw new ApiError(402, "Tweetid is required");
	if (!isValidObjectId(tweetId)) throw new ApiError(401, "Invalid tweetid");
	if (!content && !title)
		throw new ApiError(402, "Content or title field required");

	const tweet = await Tweet.findById(tweetId);
	if (!tweet) throw new ApiError(404, "Tweet not found");
	if (tweet.owner.toString() !== req.user._id.toString())
		throw new ApiError(404, "Tweet not found");

	const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, {
		content,
		title,
	});

	res
		.status(200)
		.json(new ApiResponse(200, updatedTweet, "Successfully updated tweet"));
});

const deleteTweet = asyncHandler(async (req, res) => {
	//TODO: delete tweet

	const { tweetId } = req.params;

	if (!tweetId) throw new ApiError(402, "Tweetid is required");
	if (!isValidObjectId(tweetId)) throw new ApiError(401, "Invalid tweetid");

	const tweet = await Tweet.findByIdAndDelete(tweetId);
	if (!tweet) throw new ApiError(404, "Tweet not found");

	res.status(200).json(new ApiResponse(200, {}, "Successfully updated tweet"));
});

const getUserTweets = asyncHandler(async (req, res) => {
	// TODO: get user tweets
	// get user from req.user
	// aggregate with User.aggregate
	// return user tweets

	const { userId } = req.params;
	if (!userId) throw new ApiError(400, "userId is required");
	if (!isValidObjectId(userId)) throw new ApiError(402, "Invalid userId ");

	const user = await User.findById(userId);
	if (!user) throw new ApiError(404, "user not found");

	const tweets = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
		{ $lookup: { from: "tweets", localField: "tweets", foreignField: "tweets", as: "tweets", }, },
		{ $project: { tweets: 1, username: 1, _id: 0, },
		},
	]);

	if (!tweets?.tweets?.length) throw new ApiError(404, "No tweets found");

	res
		.status(200)
		.json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
});

export { createTweet, updateTweet, deleteTweet, getUserTweets };
