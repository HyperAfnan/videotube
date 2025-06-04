import { body, param, query } from "express-validator";
import { User } from "../user/user.models.js";
import { Video } from "./video.models.js";
import { ApiError } from "../../utils/apiErrors.js";

export const permsAndVideoIdValidator = async function (req, _, next) {
	const { videoId } = req.params;
	const video = await Video.findById(videoId);
	if (!video) throw new ApiError(404, "Video not found");
	if (video.owner._id.toString() !== req.user._id.toString()) {
		throw new ApiError(402, "Unauthorized to perform this operation");
	}
	req.video = video;
	next();
};

export const getAllVideosValidator = [
	query("page").optional().isNumeric().withMessage("Page must be number"),
	query("limit").optional().isNumeric().withMessage("Page must be number"),
	query("sortBy").optional().isString().withMessage("sortBy must be string"),
	query("sortType")
		.optional()
		.isString()
		.withMessage("sortType must be string"),
	query("q")
		.isEmpty()
		.withMessage("Query q is required")
		.isString()
		.withMessage("Query q must be string")
		.trim(),
	query("userId")
		.optional()
		.isString()
		.withMessage("userId must be string")
		.isMongoId()
		.withMessage("invalid userId")
		.custom(async (userId) => {
			const user = await User.findById(userId);
			if (!user) throw new ApiError(404, "user not found");
			return true;
		}),
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
		.isEmpty()
		.withMessage("videoId is required")
		.isString()
		.withMessage("videoId must be string")
		.isMongoId()
		.withMessage("invalid videoId"),
];

export const videoIdValidator = async function (req, _, next) {
	const { videoId } = req.params;
	const video = await Video.findById(videoId);
	if (!video) throw new ApiError(404, "Video not found");
	if (video.owner._id.toString() !== req.user._id.toString()) {
		if (video.isPublished === false)
			res.status(403).json(new ApiResponse(403, {}, "Video is not published"));
	}
	req.video = video;
	next();
};

export const updateVideoValidator = [
	param("videoId")
		.isEmpty()
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
		.isEmpty()
		.withMessage("videoId is required")
		.isString()
		.withMessage("videoId must be string")
		.isMongoId()
		.withMessage("invalid videoId"),
];

export const togglePublishStatusValidator = [
	param("videoId")
		.isEmpty()
		.withMessage("videoId is required")
		.isString()
		.withMessage("videoId must be string")
		.isMongoId()
		.withMessage("invalid videoId"),
];
