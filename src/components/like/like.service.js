import mongoose from "mongoose";
import { Comment } from "../comment/comments.models.js";
import { Video } from "../video/video.models.js";
import { Tweet } from "../tweet/tweet.models.js";
import { User } from "../user/user.models.js";
import { Like } from "./like.models.js";
import { serviceHandler } from "../../utils/handlers.js";
import { logger } from "../../utils/logger/index.js";
const likeServiceLogger = logger.child({ module: "like.services" });

export const findUserById = serviceHandler(async (userId) => {
	const user = await User.findById(userId);
	return user;
});

export const findTweetById = serviceHandler(async (tweetId) => {
	const tweet = await Tweet.findById(tweetId);
	return tweet;
});

export const findVideoById = serviceHandler(async (videoId) => {
	const video = await Video.findById(videoId);
	return video;
});

export const findCommentById = serviceHandler(async (commentId) => {
	const comment = await Comment.findById(commentId);
	return comment;
});

export const isLikedVideo = serviceHandler(async (videoMeta, userMeta) => {
	const isLiked = await Like.find({
		video: videoMeta._id,
		likedBy: userMeta._id,
	});
	likeServiceLogger.info("Checked if video is liked", { videoId: videoMeta._id, userId: userMeta._id, isLiked: isLiked.length > 0 });
	return isLiked;
});

export const isLikedComment = serviceHandler(async (commentMeta, userMeta) => {
	const isLiked = await Like.find({
		comment: commentMeta._id,
		likedBy: userMeta._id,
	});
	likeServiceLogger.info("Checked if comment is liked", { commentId: commentMeta._id, userId: userMeta._id, isLiked: isLiked.length > 0 });
	return isLiked;
});

export const isLikedTweet = serviceHandler(async (tweetMeta, userMeta) => {
	const isLiked = await Like.find({
		tweet: tweetMeta._id,
		likedBy: userMeta._id,
	});
	likeServiceLogger.info("Checked if tweet is liked", { tweetId: tweetMeta._id, userId: userMeta._id, isLiked: isLiked.length > 0 });
	return isLiked;
});

export const likeVideo = serviceHandler(async (videoMeta, userMeta) => {
	const like = await Like.create({
		video: videoMeta._id,
		likedBy: userMeta._id,
	});
	likeServiceLogger.info("Video liked", { videoId: videoMeta._id, userId: userMeta._id, likeId: like._id });
	return like;
});

export const unlikeVideo = serviceHandler(async (videoMeta, userMeta) => {
	await Like.deleteOne({ video: videoMeta._id, likedBy: userMeta._id });
	likeServiceLogger.info("Video unliked", { videoId: videoMeta._id, userId: userMeta._id });
	return;
});

export const likeComment = serviceHandler(async (commentMeta, userMeta) => {
	const like = await Like.create({
		comment: commentMeta._id,
		likedBy: userMeta._id,
	});
	likeServiceLogger.info("Comment liked", { commentId: commentMeta._id, userId: userMeta._id, likeId: like._id });
	return like;
});

export const unlikeComment = serviceHandler(async (commentMeta, userMeta) => {
	await Like.deleteOne({ comment: commentMeta._id, likedBy: userMeta._id });
	likeServiceLogger.info("Comment unliked", { commentId: commentMeta._id, userId: userMeta._id });
	return;
});

export const likeTweet = serviceHandler(async (tweetMeta, userMeta) => {
	const like = await Like.create({
		tweet: tweetMeta._id,
		likedBy: userMeta._id,
	});
	likeServiceLogger.info("Tweet liked", { tweetId: tweetMeta._id, userId: userMeta._id, likeId: like._id });
	return like;
});

export const unlikeTweet = serviceHandler(async (tweetMeta, userMeta) => {
	await Like.deleteOne({ tweet: tweetMeta._id, likedBy: userMeta._id });
	likeServiceLogger.info("Tweet unliked", { tweetId: tweetMeta._id, userId: userMeta._id });
	return;
});

export const getLikedVideos = serviceHandler(async (userId) => {
	const likedVideos = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(String(userId)) } },
		{
			$lookup: {
				from: "likes",
				localField: "_id",
				foreignField: "likedBy",
				as: "likedVideos",
				pipeline: [
					{
						$lookup: {
							from: "videos",
							localField: "video",
							foreignField: "_id",
							as: "video",
							pipeline: [{ $match: { isPublished: true } }],
						},
					},
					{ $unwind: "$video" },
					{ $replaceRoot: { newRoot: "$video" } },
				],
			},
		},
		{ $project: { username: 1, likedVideos: 1 } },
	]);
	likeServiceLogger.info("Fetched liked videos for user", { userId, count: likedVideos[0]?.likedVideos?.length ?? 0 });
	return likedVideos;
});
