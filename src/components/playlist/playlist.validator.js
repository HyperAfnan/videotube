import { body, param, query } from "express-validator";
import { ApiError } from "../../utils/apiErrors.js";
import { Video } from "../video/video.models.js";
import { User } from "../user/user.models.js";
import { Playlist } from "./playlist.models.js";

export const videoIdValidator = async function (req, _, next) {
	const video = await Video.findById(req.params.videoId);
	if (!video) return next(new ApiError(404, "Video not found"));
	req.video = video;
	next();
};

export const playlistIdValidator = async function (req, _, next) {
	const playlist = await Playlist.findById(req.params.playlistId);
	if (!playlist) return next(new ApiError(404, "Playlist not found"));
	if (playlist.owner.toString() !== req.user._id.toString()) {
		return next(new ApiError(403, "Unauthorized to access this playlist"));
	}
	req.playlist = playlist;
	next();
};

export const userIdValidator = async function (req, _, next) {
	const user = await User.findById(req.query.userId);
	if (!user) return next(new ApiError(404, "User not found"));
	req.newUser = user;
	next();
};
export const createPlaylistValidator = [
	body("name")
		.notEmpty()
		.withMessage("Playlist name is required")
		.isLength({ max: 100 })
		.withMessage("Playlist name must be less than 100 characters"),
	body("description")
		.notEmpty()
		.withMessage("Playlist description is required")
		.isLength({ max: 500 })
		.withMessage("Playlist description must be less than 500 characters"),
];

export const addVideoToPlaylistValidator = [
	param("videoId")
		.notEmpty()
		.withMessage("Video ID is required")
		.isMongoId()
		.withMessage("Invalid Video ID format"),
	param("playlistId")
		.notEmpty()
		.withMessage("Playlist ID is required")
		.isMongoId()
		.withMessage("Invalid Video ID format"),
];

export const getPlaylistByIdValidator = [
	param("playlistId")
		.notEmpty()
		.withMessage("Playlist ID is required")
		.isMongoId()
		.withMessage("Invalid Playlist ID format"),
];

export const getUserPlaylistsValidator = [
	query("userId")
		.notEmpty()
		.withMessage("User ID is required")
		.isMongoId()
		.withMessage("Invalid User ID format"),
];

export const removeVideoFromPlaylistValidator = [
	param("videoId")
		.notEmpty()
		.withMessage("Video ID is required")
		.isMongoId()
		.withMessage("Invalid Video ID format"),
	param("playlistId")
		.notEmpty()
		.withMessage("Playlist ID is required")
		.isMongoId()
		.withMessage("Invalid Playlist ID format"),
];

export const deletePlaylistValidator = [
	param("playlistId")
		.notEmpty()
		.withMessage("Playlist ID is required")
		.isMongoId()
		.withMessage("Invalid Playlist ID format"),
];

export const updatePlaylistValidator = [
	param("playlistId")
		.notEmpty()
		.withMessage("Playlist ID is required")
		.isMongoId()
		.withMessage("Invalid Playlist ID format"),
	body("name")
		.optional()
		.isLength({ max: 100 })
		.withMessage("Playlist name must be less than 100 characters"),
	body("description")
		.optional()
		.isLength({ max: 500 })
		.withMessage("Playlist description must be less than 500 characters"),
];
