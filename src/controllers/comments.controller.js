import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comments.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { Video } from "../models/video.models.js";
import { Tweet } from "../models/tweet.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const getComments = asyncHandler(async (req, res) => {
	//TODO: get all comments for a video
	const { id } = req.params;
	const { page = 1, limit = 10 } = req.query;

	if (!id) throw new ApiError(402, "commentid is required");
	if (!isValidObjectId(id)) throw new ApiError(402, "invalid comment id");

	var idOf;
	const video = await Video.findById(id);
	const tweet = await Tweet.findById(id);
	if (video) idOf = "video";
	else if (tweet) idOf = "tweet";
	else throw new ApiError(404, "Video or Tweet not found");

	const customLabels = {
		totalDocs: "totalComments",
		docs: "video",
		page: "currentPage",
	};
	const options = { page, limit, customLabels };

	const pipeline = [
		{ $match: { _id: new mongoose.Types.ObjectId(id) } },
		{
			$lookup: {
				from: "comments",
				localField: "_id",
				foreignField: idOf,
				as: "comments",
				pipeline: [
					{
						$lookup: {
							from: "users",
							localField: "user",
							foreignField: "_id",
							as: "user",
							pipeline: [
								{
									$project: {
										username: 1,
										avatar: 1,
									},
								},
							],
						},
					},
				],
			},
		},
		{ $project: { comments: 1, title: 1, owner: 1 } },
	];

	if (idOf == "video") {
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
	} else if (idOf == "tweet") {
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
	}
});

const addComment = asyncHandler(async (req, res) => {
	// TODO: add a comment to a video
	const { id } = req.params;
	const {content } = req.body;

	if (!id) throw new ApiError(402, "Video is required");
	if (!content) throw new ApiError(402, "Comment is required");
	if (!isValidObjectId(id)) throw new ApiError(402, "Invalid video id");

	var idOf;
	const video = await Video.findById(id);
	const tweet = await Tweet.findById(id);
	if (video) idOf = "video";
	else if (tweet) idOf = "tweet";
	else throw new ApiError(404, "Video or Tweet not found");

	const comment = await Comment.create({
		[idOf]: id,
		user: req.user._id,
		content,
	});

	res
		.status(200)
		.json(new ApiResponse(200, comment, "Successfully commented on the video"));
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
   if (comment.user.toString() !== req.user._id.toString()) throw new ApiError(404, "Comment not found");

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
   if (comment.user.toString() !== req.user._id.toString()) throw new ApiError(404, "Comment not found");

	await Comment.findByIdAndDelete(comment._id);

	res
		.status(200)
		.json(new ApiResponse(200, {}, "Successfully deleted comment"));
});

export { getComments, addComment, updateComment, deleteComment };
