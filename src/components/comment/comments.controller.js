import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as CommentService from "./comment.service.js";
import { logger } from "../../utils/logger/index.js";
const commentLogger = logger.child({ module: "comment.controllers" });

const getVideoComments = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10 } = req.query;
	const { id } = req.params;

	commentLogger.info("GET /comments/video - Fetching comments", { videoId: id, page, limit, userId: req.user?._id });

	const video = await CommentService.getVideoById(id);
	if (!video) {
		commentLogger.warn("Video not found while fetching comments", { videoId: id });
		throw new ApiError(404, "Video not found");
	}

	const data = await CommentService.getVideoComments(page, limit, video, req.user);
	commentLogger.info("Fetched video comments successfully", { videoId: id, userId: req.user?._id, commentCount: data?.length });

	return res
		.status(200)
		.json(new ApiResponse(200, data, "successfully got all comments"));
});

const getTweetComments = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10 } = req.query;
	const { id } = req.params;

	commentLogger.info("GET /comments/tweet - Fetching comments", { tweetId: id, page, limit, userId: req.user?._id });

	const tweet = await CommentService.getTweetById(id);
	if (!tweet) {
		commentLogger.warn("Tweet not found while fetching comments", { tweetId: id });
		throw new ApiError(404, "Tweet not found");
	}

	const data = await CommentService.getTweetComments(page, limit, tweet, req.user);
	commentLogger.info("Fetched tweet comments successfully", { tweetId: id, userId: req.user?._id, commentCount: data?.length });

	return res
		.status(200)
		.json(new ApiResponse(200, data, "successfully got all comments"));
});

const addVideoComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const { id } = req.params;

	commentLogger.info("POST /comments/video - Adding comment", { videoId: id, userId: req.user?._id });

	const video = await CommentService.getVideoById(id);
	if (!video) {
		commentLogger.warn("Video not found while adding comment", { videoId: id });
		throw new ApiError(404, "Video not found");
	}

	const comment = await CommentService.addVideoComment(video, req.user, content);
	commentLogger.info("Comment added to video", { videoId: id, userId: req.user?._id, commentId: comment?._id });

	return res
		.status(201)
		.json(new ApiResponse(201, comment, "Successfully commented on the video"));
});

const addTweetComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const { id } = req.params;

	commentLogger.info("POST /comments/tweet - Adding comment", { tweetId: id, userId: req.user?._id });

	const tweet = await CommentService.getTweetById(id);
	if (!tweet) {
		commentLogger.warn("Tweet not found while adding comment", { tweetId: id });
		throw new ApiError(404, "Tweet not found");
	}

	const comment = await CommentService.addTweetComment(tweet, req.user, content);
	commentLogger.info("Comment added to tweet", { tweetId: id, userId: req.user?._id, commentId: comment?._id });

	return res
		.status(201)
		.json(new ApiResponse(201, comment, "Successfully commented on the tweet"));
});

const updateComment = asyncHandler(async (req, res) => {
	const { content } = req.body;
	const { commentId } = req.params;

	commentLogger.info("PATCH /comments/:commentId - Updating comment", { commentId, userId: req.user?._id });

	const comment = await CommentService.getCommentById(commentId);
	if (!comment) {
		commentLogger.warn("Comment not found while updating", { commentId });
		throw new ApiError(404, "Comment not found");
	}

	const isCommentUser = await CommentService.isCommentUser(comment, req.user);
	if (!isCommentUser) {
		commentLogger.warn("Unauthorized comment update attempt", { commentId, userId: req.user?._id });
		throw new ApiError(403, "Not authorized to perform this operation");
	}

	const updatedComment = await CommentService.updateComment(comment, content);
	commentLogger.info("Comment updated successfully", { commentId, userId: req.user?._id });

	return res
		.status(200)
		.json(new ApiResponse(200, updatedComment, "Successfully updated comment"));
});

const deleteComment = asyncHandler(async (req, res) => {
	const { commentId } = req.params;

	commentLogger.info("DELETE /comments/:commentId - Deleting comment", { commentId, userId: req.user?._id });

	const comment = await CommentService.getCommentById(commentId);
	if (!comment) {
		commentLogger.warn("Comment not found while deleting", { commentId });
		throw new ApiError(404, "Comment not found");
	}

	const isCommentUser = await CommentService.isCommentUser(comment, req.user);
	if (!isCommentUser) {
		commentLogger.warn("Unauthorized comment delete attempt", { commentId, userId: req.user?._id });
		throw new ApiError(403, "Not authorized to perform this operation");
	}

	await CommentService.deleteComment(comment);
	commentLogger.info("Comment deleted successfully", { commentId, userId: req.user?._id });

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
