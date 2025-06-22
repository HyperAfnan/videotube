import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as CommentService from "./comment.service.js";
import { logger } from "../../utils/logger/index.js";
const commentLogger = logger.child({ module: "comment.controllers" });

const getVideoComments = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10 } = req.query;
	const { id } = req.params;
	const requestId = req.id;

	commentLogger.info(`[Request] ${requestId} GET /comments/video - Fetching comments`, {
		videoId: id,
		page,
		limit,
		userId: req.user?._id,
	});

	const video = await CommentService.getVideoById(id);
	if (!video) {
		throw new ApiError(404, "Video not found", { videoId: id, requestId });
	}

	const data = await CommentService.getVideoComments(
		page,
		limit,
		video,
		req.user,
	);

	commentLogger.info(`[Request] ${requestId} Fetched video comments successfully`, {
		videoId: id,
		userId: req.user?._id,
		commentCount: data?.length,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, data, "successfully got all comments"));
});

const getTweetComments = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10 } = req.query;
	const { id } = req.params;
	const requestId = req.id;

	commentLogger.info(`[Request] ${requestId} GET /comments/tweet - Fetching comments`, {
		tweetId: id,
		page,
		limit,
		userId: req.user?._id,
	});

	const tweet = await CommentService.getTweetById(id);
	if (!tweet) {
		throw new ApiError(404, "Tweet not found", { tweetId: id, requestId });
	}

	const data = await CommentService.getTweetComments(
		page,
		limit,
		tweet,
		req.user,
	);

	commentLogger.info(`[Request] ${requestId} Fetched tweet comments successfully`, {
		tweetId: id,
		userId: req.user?._id,
		commentCount: data?.length,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, data, "successfully got all comments"));
});

const addVideoComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const { id } = req.params;
	const requestId = req.id;

	commentLogger.info(`[Request] ${requestId} POST /comments/video - Adding comment`, {
		videoId: id,
		userId: req.user?._id,
	});

	const video = await CommentService.getVideoById(id);
	if (!video) {
		throw new ApiError(404, "Video not found", { videoId: id, requestId });
	}

	const comment = await CommentService.addVideoComment(
		video,
		req.user,
		content,
	);

	commentLogger.info(`[Request] ${requestId} Comment added to video`, {
		videoId: id,
		userId: req.user?._id,
		commentId: comment?._id,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, comment, "Successfully commented on the video"));
});

const addTweetComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const { id } = req.params;
	const requestId = req.id;

	commentLogger.info(`[Request] ${requestId} POST /comments/tweet - Adding comment`, {
		tweetId: id,
		userId: req.user?._id,
	});

	const tweet = await CommentService.getTweetById(id);
	if (!tweet) {
		throw new ApiError(404, "Tweet not found", { tweetId: id, requestId });
	}

	const comment = await CommentService.addTweetComment(
		tweet,
		req.user,
		content,
	);

	commentLogger.info(`[Request] ${requestId} Comment added to tweet`, {
		tweetId: id,
		userId: req.user?._id,
		commentId: comment?._id,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, comment, "Successfully commented on the tweet"));
});

const updateComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const { commentId } = req.params;
	const requestId = req.id;

	commentLogger.info(`[Request] ${requestId} PATCH /comments/:commentId - Updating comment`, {
		commentId,
		userId: req.user?._id,
	});

	const comment = await CommentService.getCommentById(commentId);
	if (!comment) {
		throw new ApiError(404, "Comment not found", { commentId, requestId });
	}

	const isCommentUser = await CommentService.isCommentUser(comment, req.user);
	if (!isCommentUser) {
		throw new ApiError(403, "Not authorized to perform this operation", {
			commentId,
			requestId,
		});
	}

	const updatedComment = await CommentService.updateComment(comment, content);

	commentLogger.info(`[Request] ${requestId} Comment updated successfully`, {
		commentId,
		userId: req.user?._id,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, updatedComment, "Successfully updated comment"));
});

const deleteComment = asyncHandler(async (req, res) => {
	const { commentId } = req.params;
	const requestId = req.id;

	commentLogger.info(`[Request] ${requestId} DELETE /comments/:commentId - Deleting comment`, {
		commentId,
		userId: req.user?._id,
	});

	const comment = await CommentService.getCommentById(commentId);
	if (!comment) {
		throw new ApiError(404, "Comment not found", { commentId, requestId });
	}

	const isCommentUser = await CommentService.isCommentUser(comment, req.user);
	if (!isCommentUser) {
		throw new ApiError(403, "Not authorized to perform this operation", {
			commentId,
			requestId,
		});
	}

	await CommentService.deleteComment(comment);

	commentLogger.info(`[Request] ${requestId} Comment deleted successfully`, {
		commentId,
		userId: req.user?._id,
	});

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
