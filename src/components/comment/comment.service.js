import mongoose from "mongoose";
import { ApiError } from "../../utils/apiErrors.js";
import { serviceHandler } from "../../utils/handlers.js";
import { Tweet } from "../tweet/tweet.models.js";
import { Video } from "../video/video.models.js";
import debug from "debug";
const commentDebug = debug("app:commentService");

export const getVideoComments = serviceHandler(
	async (page, limit, videoMeta) => {
		const customLabels = {
			totalDocs: "totalComments",
			docs: "video",
			page: "currentPage",
		};

		const options = { page, limit, customLabels };

		const pipeline = [
			{ $match: { _id: new mongoose.Types.ObjectId(videoMeta._id) } },
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

		await Video.aggregatePaginate(aggregation, options)
			.then((data) => data)
			.catch((err) => {
				commentDebug(`Error in getVideoComments ${err}`);
				throw new ApiError(500, "Internal server error");
			});
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
			{ $match: { _id: new mongoose.Types.ObjectId(tweetMeta._id) } },
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

		await Tweet.aggregatePaginate(aggregation, options)
			.then((data) => data)
			.catch((err) => {
				commentDebug(`Error in getTweetComments ${err}`);
				throw new ApiError(500, "Internal server error");
			});
	},
);

export const addVideoComment = serviceHandler(
	async (videoMeta, userMeta, content) => {
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

export const deleteComment = serviceHandler(async (commentMeta) => {
	await Comment.findByIdAndDelete(commentMeta);
});
