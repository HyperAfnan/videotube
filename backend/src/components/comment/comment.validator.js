import { body, param, query } from "express-validator";

export const getVideoCommentsValidator = [
	param("id")
		.notEmpty()
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
		.notEmpty()
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
		.notEmpty()
		.withMessage("Video id is required")
		.isString()
		.withMessage("video id must be string")
		.isMongoId()
		.withMessage("invalid video id"),
	body("content")
		.notEmpty()
		.withMessage("content is required")
		.isString()
		.withMessage("content must be string")
		.trim(),
];

export const addTweetCommentValidator = [
	param("id")
		.notEmpty()
		.withMessage("Tweet id is required")
		.isString()
		.withMessage("Tweet id must be string")
		.isMongoId()
		.withMessage("invalid Tweet id"),
	body("content")
		.notEmpty()
		.withMessage("content is required")
		.isString()
		.withMessage("content must be string")
		.trim(),
];

export const updateCommentValidator = [
	param("commentId")
		.notEmpty()
		.withMessage("Comment id is required")
		.isString()
		.withMessage("Comment id must be string")
		.isMongoId()
		.withMessage("invalid Comment id"),
	body("content")
		.notEmpty()
		.withMessage("content is required")
		.isString()
		.withMessage("content must be string")
		.trim(),
];

export const deleteCommentValidator = [
	param("commentId")
		.notEmpty()
		.withMessage("Comment id is required")
		.isString()
		.withMessage("Comment id must be string")
		.isMongoId()
		.withMessage("invalid Comment id"),
];
