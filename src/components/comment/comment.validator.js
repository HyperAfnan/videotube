import { body, param, query } from "express-validator";
import { Video } from "../video/video.models.js";
import { Tweet } from "../tweet/tweet.models.js";
import { ApiError } from "../../utils/apiErrors.js";

export const videoPermsChecker = async function (req, _, next) {
	const video = await Video.findById(req.params.id);
	if (!video) throw new ApiError(404, "Video not found");

	if (video.owner._id.toString() !== req.user._id.toString()) {
		if (video.isPublished === false)
			throw new ApiError(403, "Video is not published yet");
	}
	req.video = video;
	next();
};

export const tweetPermsChecker = async function (req, _, next) {
	const tweet = await Tweet.findById(req.params.id);
	if (!tweet) throw new ApiError(404, "Tweet not found");

	if (tweet.owner._id.toString() !== req.user._id.toString()) {
		throw new ApiError(403, "You are not authorized to perform this operation");
	}
	req.tweet = tweet;
	next();
};

export const videoIdValidator = async function (req, _, next) {
	const video = await Video.findById(req.params.id);
	if (!video) throw new ApiError(404, "Video not found");
	req.video = video;
	next();
};
export const tweetidValidator = async function (req, _, next) {
	const tweet = await Tweet.findById(req.params.id);
	if (!tweet) throw new ApiError(404, "Tweet not found");
	req.tweet = tweet;
	next();
};

export const getVideoCommentsValidator = [
	param("id")
		.isEmpty()
		.withMessage("Video id is required")
		.isString()
		.withMessage("video id must be string")
		.isMongoId()
		.withMessage("invalid video id"),
	query("page")
		.optional()
		.isNumeric()
		.withMessage(" page number must be a number"),
	query("limit")
		.optional()
		.isNumeric()
		.withMessage(" page number must be a number"),
];

export const getTweetCommentsValidator = [
	param("id")
		.isEmpty()
		.withMessage("Tweet id is required")
		.isString()
		.withMessage("Tweet id must be string")
		.isMongoId()
		.withMessage("invalid Tweet id"),
	query("page")
		.optional()
		.isNumeric()
		.withMessage(" page number must be a number"),
	query("limit")
		.optional()
		.isNumeric()
		.withMessage(" page number must be a number"),
];

export const addVideoCommentValidator = [
	param("id")
		.isEmpty()
		.withMessage("Video id is required")
		.isString()
		.withMessage("video id must be string")
		.isMongoId()
		.withMessage("invalid video id"),
	body("content")
		.isEmpty()
		.withMessage("content is required")
		.isString()
		.withMessage("content must be string")
		.trim(),
];

export const addTweetCommentValidator = [
	param("id")
		.isEmpty()
		.withMessage("Tweet id is required")
		.isString()
		.withMessage("Tweet id must be string")
		.isMongoId()
		.withMessage("invalid Tweet id"),
	body("content")
		.isEmpty()
		.withMessage("content is required")
		.isString()
		.withMessage("content must be string")
		.trim(),
];

export const updateCommentValidator = [
	param("commentId")
		.isEmpty()
		.withMessage("Comment id is required")
		.isString()
		.withMessage("Comment id must be string")
		.isMongoId()
		.withMessage("invalid Comment id"),
	body("content")
		.isEmpty()
		.withMessage("content is required")
		.isString()
		.withMessage("content must be string")
		.trim(),
];

export const commentIdValidatorAndPermsCheck = async function (req, _, next) {
	const comment = await Comment.findById(req.params.commentId);
	if (!comment) throw new ApiError(404, "Comment not found");
	if (comment.user.toString() !== req.user._id.toString())
		throw new ApiError(402, "Unauthorized to update comment");
	req.comment = comment;
	next();
};

export const deleteCommentValidator = [
	param("commentId")
		.isEmpty()
		.withMessage("Comment id is required")
		.isString()
		.withMessage("Comment id must be string")
		.isMongoId()
		.withMessage("invalid Comment id"),
];
