import { param } from "express-validator";

export const addVideoToWatchLaterValidator = [
	param("videoId")
		.notEmpty()
		.withMessage("videoId is required")
		.isString()
		.withMessage("videoId must be string")
		.isMongoId()
		.withMessage("invalid videoId"),
];

export const removeVideoFromWatchLaterValidator = [
	param("videoId")
		.notEmpty()
		.withMessage("videoId is required")
		.isString()
		.withMessage("videoId must be string")
		.isMongoId()
		.withMessage("invalid videoId"),
];

