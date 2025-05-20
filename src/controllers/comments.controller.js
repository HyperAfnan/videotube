import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comments.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { Video } from "../models/video.models.js";
import { Tweet } from "../models/tweet.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
	//TODO: get all comments for a video
	const { id } = req.params;
	const { page = 1, limit = 10 } = req.query;

	if (!id) throw new ApiError(402, "commentid is required");
	if (!isValidObjectId(id)) throw new ApiError(402, "invalid comment id");

	const video = await Video.findById(id);
   if (!video) throw new ApiError(404, "Video not found");

	const customLabels = {
		totalDocs: "totalComments",
		docs: "video",
		page: "currentPage",
	};
	const options = { page, limit, customLabels };

	const pipeline = [
		{ $match: { _id: new mongoose.Types.ObjectId(id) } },
		{ $lookup: { from: "comments", localField: "_id", foreignField: "video", as: "comments",
				pipeline: [
					{ $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user",
							pipeline: [ { $project: { username: 1, avatar: 1, }, }, ],
						},
					},
				],
			},
		},
		{ $project: { comments: 1, title: 1, owner: 1 } },
	];

		const aggregation = Video.aggregate(pipeline);

		await Video.aggregatePaginate(aggregation, options)
			.then(function (data) {
				res
					.status(200)
					.json(new ApiResponse(200, data, "successfully got all comments"));
			})
			.catch(function (err) {
				console.log(err);
				throw new ApiError(500, "Internal server error");
			});
	});

const getTweetComments = asyncHandler(async (req, res) => {
	//TODO: get all comments for a tweet
	const { id } = req.params;
	const { page = 1, limit = 10 } = req.query;

	if (!id) throw new ApiError(402, "commentid is required");
	if (!isValidObjectId(id)) throw new ApiError(402, "invalid comment id");

	const tweet = await Tweet.findById(id);
   if (!tweet) throw new ApiError(404, "Tweet not found");

	const customLabels = {
		totalDocs: "totalComments",
		docs: "tweet",
		page: "currentPage",
	};
	const options = { page, limit, customLabels };

	const pipeline = [
		{ $match: { _id: new mongoose.Types.ObjectId(id) } },
		{ $lookup: { from: "comments", localField: "_id", foreignField: "tweet", as: "comments",
				pipeline: [
					{ $lookup: { from: "users", localField: "user", foreignField: "_id", as: "user",
							pipeline: [
								{ $project: { username: 1, avatar: 1, }, },
							],
						},
					},
				],
			},
		},
		{ $project: { comments: 1, title: 1, owner: 1 } },
	];

	const aggregation = Tweet.aggregate(pipeline);

	await Tweet.aggregatePaginate(aggregation, options)
		.then(function (data) {
			res
				.status(200)
				.json(new ApiResponse(200, data, "successfully got all comments"));
		})
		.catch(function (err) {
			console.log(err);
			throw new ApiError(500, "Internal server error");
		});
});

const addVideoComment = asyncHandler(async (req, res) => {
	// TODO: add a comment to a video
	const { id } = req.params;
	const { content } = req.body;

	if (!id) throw new ApiError(402, "Videoid is required");
	if (!content) throw new ApiError(402, "Comment is required");
	if (!isValidObjectId(id)) throw new ApiError(402, "Invalid video id");

	const video = await Video.findById(id);
   if (!video) throw new ApiError(404, "Video not found");

	const comment = await Comment.create({ video: id, user: req.user._id, content });

	res
		.status(200)
		.json(new ApiResponse(200, comment, "Successfully commented on the video"));
});

const addTweetComment = asyncHandler(async (req, res) => {
	// TODO: add a comment to a tweet
	const { id } = req.params;
	const { content } = req.body;

	if (!id) throw new ApiError(402, "tweetid is required");
	if (!content) throw new ApiError(402, "Comment is required");
	if (!isValidObjectId(id)) throw new ApiError(402, "Invalid tweet id");

	const tweet = await Tweet.findById(id);
   if (!tweet) throw new ApiError(404, "Tweet not found");

	const comment = await Comment.create({ tweet: id, user: req.user._id, content, });

	res
		.status(200)
		.json(new ApiResponse(200, comment, "Successfully commented on the tweet"));
});


const updateComment = asyncHandler(async (req, res) => {
	// TODO: update a comment
	const { content } = req.body;
	const { commentId } = req.params;
	if (!commentId) throw new ApiError(402, "commentid is required");
	if (!content) throw new ApiError(402, "content is required");
	if (!isValidObjectId(commentId)) throw new ApiError(402, "Invalid commentid");

	const comment = await Comment.findById(commentId);
	if (!comment) throw new ApiError(404, "Comment not found");
	if (comment.user.toString() !== req.user._id.toString())
		throw new ApiError(404, "Comment not found");

	const updatedComment = await Comment.findByIdAndUpdate(comment._id, {
		content,
	});

	res
		.status(200)
		.json(new ApiResponse(200, updatedComment, "Successfully updated comment"));
});

const deleteComment = asyncHandler(async (req, res) => {
	// TODO: delete a comment
	const { commentId } = req.params;
	if (!commentId) throw new ApiError(402, "commentid is required");
	if (!isValidObjectId(commentId)) throw new ApiError(402, "Invalid commentid");

	const comment = await Comment.findById(commentId);
	if (!comment) throw new ApiError(404, "Comment not found");
	if (comment.user.toString() !== req.user._id.toString())
		throw new ApiError(404, "Comment not found");

	await Comment.findByIdAndDelete(comment._id);

	res
		.status(200)
		.json(new ApiResponse(200, {}, "Successfully deleted comment"));
});

export {
	getVideoComments,
	getTweetComments,
	addVideoComment,
   addTweetComment,
	updateComment,
	deleteComment,
};
