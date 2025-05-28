import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as CommentService from "./comment.service.js";

const getVideoComments = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10 } = req.query;

	const data = await CommentService.getVideoComments(page, limit, req.video);
	return res
		.status(200)
		.json(new ApiResponse(200, data, "successfully got all comments"));
});

const getTweetComments = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10 } = req.query;
	const data = await CommentService.getTweetComments(page, limit, req.tweet);
	return res
		.status(200)
		.json(new ApiResponse(200, data, "successfully got all comments"));
});

const addVideoComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const comment = await CommentService.addVideoComment(
		req.video,
		req.user,
		content
	);
	return res
		.status(201)
		.json(new ApiResponse(201, comment, "Successfully commented on the video"));
});

const addTweetComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const comment = await CommentService.addTweetComment(
		req.tweet,
		req.user,
		content
	);
	return res
		.status(201)
		.json(new ApiResponse(201, comment, "Successfully commented on the tweet"));
});

const updateComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const comment = await CommentService.updateComment(req.comment, content);
	return res
		.status(200)
		.json(new ApiResponse(200, comment, "Successfully updated comment"));
});

const deleteComment = asyncHandler(async (req, res) => {
	await CommentService.deleteComment(req.comment);
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
