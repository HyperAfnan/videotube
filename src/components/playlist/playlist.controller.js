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
		if (!playlistUser) 
         throw new ApiError(404, "User not found", { requestedUserId: userId});
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
		throw new ApiError(404, "Playlist not found", { playlistId });
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
		throw new ApiError(404, "Playlist not found", { playlistId , videoId });
	}

	const video = await PlaylistService.findVideoById(videoId);
	if (!video) {
		throw new ApiError(404, "Video not found", { playlistId, videoId });
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		throw new ApiError(
			403,
			"You are not authorized to add video to this playlist",
         { playlistId, videoId }
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
		throw new ApiError(404, "Playlist not found", { playlistId, videoId });
	}

	const video = await PlaylistService.findVideoById(videoId);
	if (!video) {
		throw new ApiError(404, "Video not found", { playlistId, videoId });
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		throw new ApiError(
			403,
			"You are not authorized to remove video from this playlist",
         { playlistId , videoId }
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
		throw new ApiError(404, "Playlist not found", { playlistId });
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		throw new ApiError(403, "You are not authorized to delete this playlist", { playlistId });
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
		throw new ApiError(404, "Playlist not found", { playlistId });
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		throw new ApiError(403, "You are not authorized to update this playlist", { playlistId });
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
