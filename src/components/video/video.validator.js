import { body, param, query } from "express-validator";
import { ApiError } from "../../utils/apiErrors.js";

export const getAllVideosValidator = [
	query("page").optional().isNumeric().withMessage("Page must be number"),
	query("limit").optional().isNumeric().withMessage("Page must be number"),
	query("sortBy").optional().isString().withMessage("sortBy must be string"),
	query("sortType")
		.optional()
		.isString()
		.withMessage("sortType must be string"),
	query("q")
		.notEmpty()
		.withMessage("Query q is required")
		.isString()
		.withMessage("Query q must be string")
		.trim(),
	query("userId")
		.optional()
		.isString()
		.withMessage("userId must be string")
		.isMongoId()
		.withMessage("invalid userId"),
];

export const publishVideoValidator = [
	body("title")
		.optional()
		.isString()
		.withMessage("title must be string")
		.trim(),
	body("description")
		.optional()
		.isString()
		.withMessage("title must be string")
		.trim(),
];

export const publishVideoFilesValidator = function (req, _, next) {
	if (!req?.files?.videoFile[0]?.path)
		throw new ApiError(400, "video file is required");
	if (!req?.files?.thumbnail[0]?.path)
		throw new ApiError(400, "thumbnail image is required");
	next();
};

export const getVideoByIdValidator = [
	param("videoId")
		.notEmpty()
		.withMessage("videoId is required")
		.isString()
		.withMessage("videoId must be string")
		.isMongoId()
		.withMessage("invalid videoId"),
];

export const updateVideoValidator = [
	param("videoId")
		.notEmpty()
		.withMessage("videoId is required")
		.isString()
		.withMessage("videoId must be string")
		.isMongoId()
		.withMessage("invalid videoId"),
	body("title")
		.optional()
		.isString()
		.withMessage("title must be string")
		.trim(),
	body("description")
		.optional()
		.isString()
		.withMessage("title must be string")
		.trim(),
];

export const deleteVideoValidator = [
	param("videoId")
		.notEmpty()
		.withMessage("videoId is required")
		.isString()
		.withMessage("videoId must be string")
		.isMongoId()
		.withMessage("invalid videoId"),
];

export const togglePublishStatusValidator = [
	param("videoId")
		.notEmpty()
		.withMessage("videoId is required")
		.isString()
		.withMessage("videoId must be string")
		.isMongoId()
		.withMessage("invalid videoId"),
];

export const downloadVideoValidator = [
	param("videoId")
		.notEmpty()
		.withMessage("videoId is required")
		.isString()
		.withMessage("videoId must be string")
		.isMongoId()
		.withMessage("invalid videoId"),
];
