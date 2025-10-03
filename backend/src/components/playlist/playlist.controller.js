import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as PlaylistService from "./playlist.service.js";
import { logger } from "../../utils/logger/index.js";
const playlistLogger = logger.child({ module: "playlist.controller" });

const createPlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
	const requestId = req.id;

	playlistLogger.info(`[Request] ${requestId} Creating playlist`, {
		userId: req.user._id,
		name,
	});

	const playlist = await PlaylistService.createPlaylistService(
		name,
		description,
		req.user,
	);

	playlistLogger.info(`[Request] ${requestId} Playlist created successfully`, {
		userId: req.user._id,
		playlistId: playlist._id,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, playlist, "Successfully created playlist"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const requestId = req.id;

	if (userId) {
		playlistLogger.info(
			`[Request] ${requestId} Fetching playlists for user by param`,
			{
				requestedUserId: userId,
			},
		);
		const playlistUser = await PlaylistService.findUserById(userId);
		if (!playlistUser)
			throw new ApiError(404, "User not found", {
				requestedUserId: userId,
				requestId,
			});
	}

	const user = userId || req.user._id;
	const playlists = await PlaylistService.getUserPlaylistsService(user);

	playlistLogger.info(`[Request] ${requestId} Fetched playlists for user`, {
		userId: user,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, playlists, "Successfully get user playlist"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;
	const requestId = req.id;

	playlistLogger.info(`[Request] ${requestId} Fetching playlist by ID`, {
		playlistId,
	});

	const playlist = await PlaylistService.findPlaylistById(playlistId);
	if (!playlist) {
		throw new ApiError(404, "Playlist not found", { playlistId, requestId });
	}

	playlistLogger.info(`[Request] ${requestId} Fetched playlist by ID`, {
		playlistId,
		ownerId: playlist.owner,
	});

	res
		.status(200)
		.json(new ApiResponse(200, playlist, "Successfully get playlist"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req.params;
	const requestId = req.id;

	playlistLogger.info(`[Request] ${requestId} Adding video to playlist`, {
		playlistId,
		videoId,
		userId: req.user._id,
	});

	const playlist = await PlaylistService.findPlaylistById(playlistId);
	if (!playlist) {
		throw new ApiError(404, "Playlist not found", {
			playlistId,
			videoId,
			requestId,
		});
	}

	const video = await PlaylistService.findVideoById(videoId);
	if (!video) {
		throw new ApiError(404, "Video not found", {
			playlistId,
			videoId,
			requestId,
		});
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		throw new ApiError(
			403,
			"You are not authorized to add video to this playlist",
			{ playlistId, videoId, requestId },
		);
	}

	const updatedPlaylist = await PlaylistService.addVideoToPlaylistService(
		playlist,
		video,
	);

	if (updatedPlaylist.message) {
		playlistLogger.info(
			`[Request] ${requestId} Video already in playlist or other message`,
			{
				playlistId,
				videoId,
				userId: req.user._id,
				message: updatedPlaylist.message,
			},
		);
		return res
			.status(200)
			.json(
				new ApiResponse(200, updatedPlaylist.playlist, updatedPlaylist.message),
			);
	}

	playlistLogger.info(`[Request] ${requestId} Video added to playlist`, {
		playlistId,
		videoId,
		userId: req.user._id,
	});

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
	const requestId = req.id;

	playlistLogger.info(`[Request] ${requestId} Removing video from playlist`, {
		playlistId,
		videoId,
		userId: req.user._id,
	});

	const playlist = await PlaylistService.findPlaylistById(playlistId);
	if (!playlist) {
		throw new ApiError(404, "Playlist not found", {
			playlistId,
			videoId,
			requestId,
		});
	}

	const video = await PlaylistService.findVideoById(videoId);
	if (!video) {
		throw new ApiError(404, "Video not found", {
			playlistId,
			videoId,
			requestId,
		});
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		throw new ApiError(
			403,
			"You are not authorized to remove video from this playlist",
			{ playlistId, videoId, requestId },
		);
	}

	const updatedPlaylist = await PlaylistService.removeVideoFromPlaylistService(
		playlist,
		video,
	);

	playlistLogger.info(`[Request] ${requestId} Video removed from playlist`, {
		playlistId,
		videoId,
		userId: req.user._id,
	});

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
	const requestId = req.id;

	playlistLogger.info(`[Request] ${requestId} Deleting playlist`, {
		playlistId,
		userId: req.user._id,
	});

	const playlist = await PlaylistService.findPlaylistById(playlistId);
	if (!playlist) {
		throw new ApiError(404, "Playlist not found", { playlistId, requestId });
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		throw new ApiError(403, "You are not authorized to delete this playlist", {
			playlistId,
			requestId,
		});
	}

	await PlaylistService.deletePlaylistService(playlist);

	playlistLogger.info(`[Request] ${requestId} Playlist deleted`, {
		playlistId,
		userId: req.user._id,
	});

	return res.status(204).end();
});

const updatePlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
	const { playlistId } = req.params;
	const requestId = req.id;

	playlistLogger.info(`[Request] ${requestId} Updating playlist`, {
		playlistId,
		userId: req.user._id,
	});

	const playlist = await PlaylistService.findPlaylistById(playlistId);
	if (!playlist) {
		throw new ApiError(404, "Playlist not found", { playlistId, requestId });
	}

	const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
	if (!isOwner) {
		throw new ApiError(403, "You are not authorized to update this playlist", {
			playlistId,
			requestId,
		});
	}

	const updatedPlaylist = await PlaylistService.updatePlaylistService(
		playlist,
		name,
		description,
		req?.file?.path,
	);

	playlistLogger.info(`[Request] ${requestId} Playlist updated successfully`, {
		playlistId,
		userId: req.user._id,
	});

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
