import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
	//TODO: create tweet
});

const getUserTweets = asyncHandler(async (req, res) => {
	// TODO: get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
	//TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {
	//TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
