import mongoose from "mongoose";
import { ApiError } from "../../utils/apiErrors.js";
import { serviceHandler } from "../../utils/handlers.js";
import { Tweet } from "../tweet/tweet.model.js";
import { Video } from "../video/video.model.js";
import { Comment } from "./comments.model.js";
import { logger } from "../../utils/logger/index.js";
const commentLogger = logger.child({ module: "comment.service" });

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

export const isCommentUser = serviceHandler(async (comment, user) => {
	const isOwner = comment.user.toString() === user._id.toString();
	return isOwner;
});

export const getVideoComments = serviceHandler(
	async (page, limit, videoMeta, userMeta) => {
		const customLabels = {
			totalDocs: "totalComments",
			docs: "video",
			page: "currentPage",
		};

		const options = { page, limit, customLabels };

		commentLogger.info("Fetching comments for video", {
			videoId: videoMeta._id,
			userId: userMeta?._id,
			page,
			limit,
		});

		// checks if a user is trying to access a private video comments
		if (
			!videoMeta.isPublished &&
			videoMeta.owner.toString() !== userMeta._id.toString()
		) {
			throw new ApiError(
				403,
				"You are not allowed to view this video comments",
				{ videoId: videoMeta._id },
			);
		}

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
				commentLogger.error("Error in getVideoComments", {
					error: err,
					videoId: videoMeta._id,
					userId: userMeta._id,
				});
				throw new ApiError(500, "Internal server error");
			},
		);

		commentLogger.info("Fetched video comments", {
			videoId: videoMeta._id,
			userId: userMeta._id,
			commentCount: data?.video?.length,
		});
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

		commentLogger.info("Fetching comments for tweet", {
			tweetId: tweetMeta._id,
			page,
			limit,
		});

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
				commentLogger.error("Error in getTweetComments", {
					error: err,
					tweetId: tweetMeta._id,
				});
				throw new ApiError(500, "Internal server error");
			},
		);

		commentLogger.info("Fetched tweet comments", {
			tweetId: tweetMeta._id,
			commentCount: data?.tweet?.length,
		});
		return data;
	},
);

export const addVideoComment = serviceHandler(
	async (videoMeta, userMeta, content) => {
		commentLogger.info("Adding comment to video", {
			videoId: videoMeta._id,
			userId: userMeta._id,
		});

		if (
			!videoMeta.isPublished &&
			videoMeta.owner.toString() !== userMeta._id.toString()
		) {
			throw new ApiError(403, "You are not allowed to comment on this video", {
				videoId: videoMeta._id,
			});
		}

		const comment = await Comment.create({
			video: videoMeta._id,
			user: userMeta._id,
			content,
		});

		if (!comment) {
			throw new ApiError(500, "Failed to add comment", {
				videoId: videoMeta._id,
			});
		}

		commentLogger.info("Added comment to video", {
			videoId: videoMeta._id,
			userId: userMeta._id,
			commentId: comment._id,
		});
		return comment;
	},
);

export const addTweetComment = serviceHandler(
	async (tweetMeta, userMeta, content) => {
		commentLogger.info("Adding comment to tweet", {
			tweetId: tweetMeta._id,
			userId: userMeta._id,
		});

		const comment = await Comment.create({
			tweet: tweetMeta._id,
			user: userMeta._id,
			content,
		});

		if (!comment) {
			throw new ApiError(500, "Failed to add comment", {
				tweetId: tweetMeta._id,
			});
		}

		commentLogger.info("Added comment to tweet", {
			tweetId: tweetMeta._id,
			userId: userMeta._id,
			commentId: comment._id,
		});
		return comment;
	},
);

export const updateComment = serviceHandler(async (commentMeta, content) => {
	const comment = await Comment.findByIdAndUpdate(
		commentMeta._id,
		{ content },
		{ new: true },
	);
	commentLogger.info("Updated comment", {
		commentId: commentMeta._id,
		updated: !!comment,
	});
	return comment;
});

// TODO:delete corresponding likes too
export const deleteComment = serviceHandler(async (commentMeta) => {
	await Comment.findByIdAndDelete(commentMeta._id);
	commentLogger.info("Deleted comment", { commentId: commentMeta._id });
});
