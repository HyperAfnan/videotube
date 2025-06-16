import { body, oneOf, param, query } from "express-validator";

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
      .optional()
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
	oneOf(
		[
			body("name")
				.optional()
				.isLength({ max: 100 })
				.withMessage("Playlist name must be less than 100 characters"),
			body("description")
				.optional()
				.isLength({ max: 500 })
				.withMessage("Playlist description must be less than 500 characters"),
		],
		{ message: "Either of field is required" },
	),
];
