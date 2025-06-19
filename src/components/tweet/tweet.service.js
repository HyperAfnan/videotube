import { ApiError } from "../../utils/apiErrors.js";
import { serviceHandler } from "../../utils/handlers.js";
import { User } from "../user/user.models.js";
import { Tweet } from "./tweet.models.js";
import { uploadImageOnCloudinary } from "../../utils/fileHandlers.js";
import mongoose from "mongoose";
import { logger } from "../../utils/logger/index.js";
const tweetServiceLogger = logger.child({ module: "tweet.services" });

export const isTweetOwner = serviceHandler(async (tweetId, userId) => {
	const tweet = await Tweet.findById(tweetId);
   return tweet.owner.toString() === userId.toString();
});

export const findUserById = serviceHandler(async (userId) => {
	const user = await User.findById(userId);
	return user;
});

export const findTweetById = serviceHandler(async (tweetId) => {
	const tweet = await Tweet.findById(tweetId);
	return tweet;
});

export const createTweet = serviceHandler(
	async (content, title, ownerId, contentImageLocalPath) => {
		let contentImage;
		if (contentImageLocalPath) {
			try {
				contentImage = await uploadImageOnCloudinary(contentImageLocalPath);
				tweetServiceLogger.info("Uploaded tweet image", { ownerId, hasImage: true });
			} catch (error) {
				tweetServiceLogger.error("Image upload failed for tweet", { ownerId, error: error.message });
				throw new ApiError(
					500,
					"Something went wrong while uploading image",
					error,
				);
			}
		}
		const tweet = await Tweet.create({
			content,
			contentImage: contentImage?.secure_url || "",
			title,
			owner: ownerId,
		});
		tweetServiceLogger.info("Tweet created", { tweetId: tweet._id, ownerId });
		return tweet;
	},
);

export const updateTweet = serviceHandler(async (content, title, tweetId) => {
	const tweet = await Tweet.findByIdAndUpdate(
		tweetId,
		{ content, title },
		{ new: true },
	);
	tweetServiceLogger.info("Tweet updated", { tweetId });
	return tweet;
});

export const deleteTweet = serviceHandler(async (tweetId) => {
	await Tweet.findByIdAndDelete(tweetId);
	tweetServiceLogger.info("Tweet deleted", { tweetId });
});

export const getUserTweets = serviceHandler(async (userId) => {
	const tweets = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(String(userId)) } },
		{
			$lookup: {
				from: "tweets",
				localField: "_id",
				foreignField: "owner",
				as: "tweets",
			},
		},
		{ $project: { tweets: 1, username: 1, _id: 0 } },
	]);
	tweetServiceLogger.info("Fetched user tweets", { userId, tweetCount: tweets[0]?.tweets?.length ?? 0 });
	return tweets;
});
