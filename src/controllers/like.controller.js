import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { Comment } from "../models/comments.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.models.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
	//TODO: toggle like on video
	const { videoId } = req.params;

	if (!videoId) throw new ApiError(402, "Video id required");
	if (!isValidObjectId(videoId)) throw new ApiError(402, "Invalid video id");

	const video = await Video.findById(videoId);
	if (!video) throw new ApiError(404, "video not found");

	const isLiked = await Like.find({ video: videoId, likedBy: req.user._id });
	if (isLiked.length > 0) {
		const like = await Like.deleteOne({
			video: videoId,
			likedBy: req.user._id,
		});
		res.status(201).json(new ApiResponse(200, like, "Undo Liked video"));
	} else {
		const like = await Like.create({ video: videoId, likedBy: req.user._id });
		res.status(201).json(new ApiResponse(200, like, "Liked video"));
	}
});

const toggleCommentLike = asyncHandler(async (req, res) => {
	//TODO: toggle like on comment
	const { commentId } = req.params;
	if (!commentId) throw new ApiError(402, "comment id required");
	if (!isValidObjectId(commentId))
		throw new ApiError(402, "Invalid comment id");

	const comment = await Comment.findById(commentId);
	if (!comment) throw new ApiError(404, "comment not found");

	const isLiked = await Like.find({
		comment: commentId,
		likedBy: req.user._id,
	});
	if (isLiked.length > 0) {
		const like = await Like.deleteOne({
			comment: commentId,
			likedBy: req.user._id,
		});
		res.status(201).json(new ApiResponse(200, like, "Undo Liked comment"));
	} else {
		const like = await Like.create({
			comment: commentId,
			likedBy: req.user._id,
		});
		res.status(201).json(new ApiResponse(200, like, "Liked comment"));
	}
});

const toggleTweetLike = asyncHandler(async (req, res) => {
	//TODO: toggle like on tweet
	const { tweetId } = req.params;

	if (!tweetId) throw new ApiError(402, "tweet id required");
	if (!isValidObjectId(tweetId)) throw new ApiError(402, "Invalid tweet id");

	const tweet = await Tweet.findById(tweetId);
	if (!tweet) throw new ApiError(404, "Tweet not found");

	const isLiked = await Like.find({ tweet: tweetId, likedBy: req.user._id });
	if (isLiked.length > 0) {
		const like = await Like.deleteOne({
			tweet: tweetId,
			likedBy: req.user._id,
		});
		res.status(201).json(new ApiResponse(200, like, "Undo Liked tweet"));
	} else {
		const like = await Like.create({ tweet: tweetId, likedBy: req.user._id });
		res.status(201).json(new ApiResponse(200, like, "Liked tweet"));
	}
});

const getLikedVideos = asyncHandler(async (req, res) => {
	//TODO: get all liked videos
	const { userId } = req.params;

	const user = userId || req.user._id;

	const likedVideos = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(user) } },
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

	if (!likedVideos) throw new ApiError(403, "No video liked");

	res
		.status(200)
		.json(new ApiResponse(200, likedVideos, "Successfully got liked videos"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
