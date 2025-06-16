import mongoose from "mongoose";
import { ApiError } from "../../utils/apiErrors.js";
import { serviceHandler } from "../../utils/handlers.js";
import { Tweet } from "../tweet/tweet.models.js";
import { Video } from "../video/video.models.js";
import { Comment } from "./comments.models.js";
import debug from "debug";
const commentDebug = debug("app:comment:service");

export const getVideoById = serviceHandler(async (videoId) => {
	const video = await Video.findById(videoId);
	return video;
});

export const getCommentById = serviceHandler(async (commentId) => {
	const comment = await Comment.findById(commentId);
	return comment;
});

export const getTweetById = serviceHandler(async (tweetId) => {
	const tweet = await Tweet.findById(tweetId);
	return tweet;
});

export const isCommentUser = serviceHandler(
	async (comment, user) => comment.user.toString() === user._id.toString(),
);

export const getVideoComments = serviceHandler(
	async (page, limit, videoMeta, userMeta) => {
		const customLabels = {
			totalDocs: "totalComments",
			docs: "video",
			page: "currentPage",
		};

		const options = { page, limit, customLabels };

		// checks if a user is trying to access a private video comments
		if (
			!videoMeta.isPublished &&
			videoMeta.owner.toString() !== userMeta._id.toString()
		)
			throw new ApiError(
				403,
				"You are not allowed to view this video comments",
			);

		const pipeline = [
			{ $match: { _id: new mongoose.Types.ObjectId(String(videoMeta._id)) } },
			{
				$lookup: {
					from: "comments",
					localField: "_id",
					foreignField: "video",
					as: "comments",
				},
			},
			{ $project: { comments: 1, _id: 0, title: 1, owner: 1 } },
		];

		const aggregation = Video.aggregate(pipeline);

		const data = await Video.aggregatePaginate(aggregation, options).catch(
			(err) => {
				commentDebug(`Error in getVideoComments ${err}`);
				throw new ApiError(500, "Internal server error");
			},
		);

		return data;
	},
);

export const getTweetComments = serviceHandler(
	async (page, limit, tweetMeta) => {
		const customLabels = {
			totalDocs: "totalComments",
			docs: "tweet",
			page: "currentPage",
		};
		const options = { page, limit, customLabels };

		const pipeline = [
			{ $match: { _id: new mongoose.Types.ObjectId(String(tweetMeta._id)) } },
			{
				$lookup: {
					from: "comments",
					localField: "_id",
					foreignField: "tweet",
					as: "comments",
				},
			},
			{ $project: { comments: 1, _id: 0, title: 1, owner: 1 } },
		];

		const aggregation = Tweet.aggregate(pipeline);

		const data = await Tweet.aggregatePaginate(aggregation, options).catch(
			(err) => {
				commentDebug(`Error in getTweetComments ${err}`);
				throw new ApiError(500, "Internal server error");
			},
		);

		return data;
	},
);

export const addVideoComment = serviceHandler(
	async (videoMeta, userMeta, content) => {
		if (
			!videoMeta.isPublished &&
			videoMeta.owner.toString() !== userMeta._id.toString()
		)
			throw new ApiError(403, "You are not allowed to comment on this video");

		const comment = await Comment.create({
			video: videoMeta._id,
			user: userMeta._id,
			content,
		});

		if (!comment) throw new ApiError(500, "Failed to add comment");

		return comment;
	},
);

export const addTweetComment = serviceHandler(
	async (tweetMeta, userMeta, content) => {
		const comment = await Comment.create({
			tweet: tweetMeta._id,
			user: userMeta._id,
			content,
		});

		if (!comment) throw new ApiError(500, "Failed to add comment");
		return comment;
	},
);

export const updateComment = serviceHandler(async (commentMeta, content) => {
	const comment = await Comment.findByIdAndUpdate(
		commentMeta._id,
		{ content },
		{ new: true },
	);
	return comment;
});

// TODO:delete corresponding likes too
export const deleteComment = serviceHandler(async (commentMeta) => {
	await Comment.findByIdAndDelete(commentMeta._id);
});
