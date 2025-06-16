import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as CommentService from "./comment.service.js";

const getVideoComments = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10 } = req.query;
   const { id } = req.params;

   const video = await CommentService.getVideoById(id)
   if (!video) throw new ApiError(404, "Video not found")

	const data = await CommentService.getVideoComments(page, limit, video);
	return res
		.status(200)
		.json(new ApiResponse(200, data, "successfully got all comments"));
});

const getTweetComments = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10 } = req.query;
   const { id } = req.params;

   const tweet = await CommentService.getTweetById(id)
   if (!tweet) throw new ApiError(404, "Tweet not found")

	const data = await CommentService.getTweetComments(page, limit, tweet, req.user);
	return res
		.status(200)
		.json(new ApiResponse(200, data, "successfully got all comments"));
});

const addVideoComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
   const { id } = req.params;

   const video = await CommentService.getVideoById(id)
   if (!video) throw new ApiError(404, "Video not found")

	const comment = await CommentService.addVideoComment(
		video,
		req.user,
		content,
	);
	return res
		.status(201)
		.json(new ApiResponse(201, comment, "Successfully commented on the video"));
});

const addTweetComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
   const { id } = req.params;

   const tweet = await CommentService.getTweetById(id)
   if (!tweet) throw new ApiError(404, "Tweet not found")

	const comment = await CommentService.addTweetComment(
		tweet,
		req.user,
		content,
	);
	return res
		.status(201)
		.json(new ApiResponse(201, comment, "Successfully commented on the tweet"));
});

const updateComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
   const { commentId } = req.params;

   const comment = await CommentService.getCommentById(commentId);
   if (!comment) throw new ApiError(404, "Video not found")

   const isCommentUser = await CommentService.isCommentUser(comment, req.user)
   if (!isCommentUser) throw new ApiError(403, "Not authorized to perform this operation")

	const updatedComment = await CommentService.updateComment(comment, content);
	return res
		.status(200)
		.json(new ApiResponse(200, updatedComment, "Successfully updated comment"));
});

const deleteComment = asyncHandler(async (req, res) => {
   const { commentId } = req.params;

   const comment = await CommentService.getCommentById(commentId);
   if (!comment) throw new ApiError(404, "Video not found")

   const isCommentUser = await CommentService.isCommentUser(comment, req.user)
   if (!isCommentUser) throw new ApiError(403, "Not authorized to perform this operation")

	await CommentService.deleteComment(comment);
	return res.status(204).end();
});

export {
	getVideoComments,
	getTweetComments,
	addVideoComment,
	addTweetComment,
	updateComment,
	deleteComment,
};
