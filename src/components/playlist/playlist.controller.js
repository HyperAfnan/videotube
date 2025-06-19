import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as PlaylistService from "./playlist.service.js";
import { logger } from "../../utils/logger/index.js";
const playlistLogger = logger.child({ module: "playlist.controller" });

const createPlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;

	playlistLogger.info("Creating playlist", { userId: req.user._id, name });

	const playlist = await PlaylistService.createPlaylistService(
		name,
		description,
		req.user,
	);

	playlistLogger.info("Playlist created successfully", { userId: req.user._id, playlistId: playlist._id });

	return res
		.status(201)
		.json(new ApiResponse(201, playlist, "Successfully created playlist"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	if (userId) {
		playlistLogger.info("Fetching playlists for user by param", { requestedUserId: userId });
		const playlistUser = await PlaylistService.findUserById(userId);
		if (!playlistUser) {
			playlistLogger.warn("User not found when fetching playlists", { requestedUserId: userId });
			throw new ApiError(404, "User not found");
		}
	}

	const user = userId || req.user._id;
	const playlists = await PlaylistService.getUserPlaylistsService(user);

	playlistLogger.info("Fetched playlists for user", { userId: user });

	return res
		.status(200)
		.json(new ApiResponse(200, playlists, "Successfully get user playlist"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;

	playlistLogger.info("Fetching playlist by ID", { playlistId });

	const playlist = await PlaylistService.findPlaylistById(playlistId);
	if (!playlist) {
		playlistLogger.warn("Playlist not found", { playlistId });
		throw new ApiError(404, "Playlist not found");
	}

	playlistLogger.info("Fetched playlist by ID", { playlistId, ownerId: playlist.owner });

	res
		.status(200)
		.json(new ApiResponse(200, playlist, "Successfully get playlist"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req.params;

	playlistLogger.info("Adding video to playlist", { playlistId, videoId, userId: req.user._id });

	const playlist = await PlaylistService.findPlaylistById(playlistId);
	if (!playlist) {
		playlistLogger.warn("Playlist not found when adding video", { playlistId, videoId });
		throw new ApiError(404, "Playlist not found");
	}

	const video = await PlaylistService.findVideoById(videoId);
	if (!video) {
		playlistLogger.warn("Video not found when adding to playlist", { playlistId, videoId });
		throw new ApiError(404, "Video not found");
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		playlistLogger.warn("Unauthorized add attempt to playlist", { playlistId, videoId, userId: req.user._id });
		throw new ApiError(
			403,
			"You are not authorized to add video to this playlist",
		);
	}

	const updatedPlaylist = await PlaylistService.addVideoToPlaylistService(
		playlist,
		video,
	);

	if (updatedPlaylist.message) {
		playlistLogger.info("Video in playlist already or message returned", { playlistId, videoId, userId: req.user._id, message: updatedPlaylist.message });
		return res
			.status(200)
			.json(
				new ApiResponse(200, updatedPlaylist.playlist, updatedPlaylist.message),
			);
	}

	playlistLogger.info("Video added to playlist", { playlistId, videoId, userId: req.user._id });

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				updatedPlaylist,
				"Successfully added video to playlist",
			),
		);
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req.params;

	playlistLogger.info("Removing video from playlist", { playlistId, videoId, userId: req.user._id });

	const playlist = await PlaylistService.findPlaylistById(playlistId);
	if (!playlist) {
		playlistLogger.warn("Playlist not found when removing video", { playlistId, videoId });
		throw new ApiError(404, "Playlist not found");
	}

	const video = await PlaylistService.findVideoById(videoId);
	if (!video) {
		playlistLogger.warn("Video not found when removing from playlist", { playlistId, videoId });
		throw new ApiError(404, "Video not found");
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		playlistLogger.warn("Unauthorized remove attempt from playlist", { playlistId, videoId, userId: req.user._id });
		throw new ApiError(
			403,
			"You are not authorized to remove video from this playlist",
		);
	}

	const updatedPlaylist = await PlaylistService.removeVideoFromPlaylistService(
		playlist,
		video,
	);

	playlistLogger.info("Video removed from playlist", { playlistId, videoId, userId: req.user._id });

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				updatedPlaylist,
				"Successfully removed video from playlist",
			),
		);
});

const deletePlaylist = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;

	playlistLogger.info("Deleting playlist", { playlistId, userId: req.user._id });

	const playlist = await PlaylistService.findPlaylistById(playlistId);
	if (!playlist) {
		playlistLogger.warn("Playlist not found when deleting", { playlistId });
		throw new ApiError(404, "Playlist not found");
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		playlistLogger.warn("Unauthorized delete attempt for playlist", { playlistId, userId: req.user._id });
		throw new ApiError(403, "You are not authorized to delete this playlist");
	}

	await PlaylistService.deletePlaylistService(playlist);

	playlistLogger.info("Playlist deleted", { playlistId, userId: req.user._id });

	return res.status(204).end();
});

const updatePlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
	const { playlistId } = req.params;

	playlistLogger.info("Updating playlist", { playlistId, userId: req.user._id });

	const playlist = await PlaylistService.findPlaylistById(playlistId);
	if (!playlist) {
		playlistLogger.warn("Playlist not found when updating", { playlistId });
		throw new ApiError(404, "Playlist not found");
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		playlistLogger.warn("Unauthorized update attempt for playlist", { playlistId, userId: req.user._id });
		throw new ApiError(403, "You are not authorized to update this playlist");
	}

	const updatedPlaylist = await PlaylistService.updatePlaylistService(
		playlist,
		name,
		description,
		req?.file?.path,
	);

	playlistLogger.info("Playlist updated successfully", { playlistId, userId: req.user._id });

	return res
		.status(200)
		.json(
			new ApiResponse(200, updatedPlaylist, "Successfully updated playlist"),
		);
});

export {
	createPlaylist,
	getUserPlaylists,
	getPlaylistById,
	addVideoToPlaylist,
	removeVideoFromPlaylist,
	deletePlaylist,
	updatePlaylist,
};
