import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as PlaylistService from "./playlist.service.js";

const createPlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;

	const playlist = await PlaylistService.createPlaylistService(
		name,
		description,
		req.user,
	);

	return res
		.status(201)
		.json(new ApiResponse(201, playlist, "Successfully created playlist"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
	const { userId } = req.params;

   if (userId) {
      const playlistUser = await PlaylistService.findUserById(userId);
      if (!playlistUser) throw new ApiError(404, "Playlist not found") 
   }

	const user = userId || req.user._id;
	const playlists = await PlaylistService.getUserPlaylistsService(user);
	return res
		.status(200)
		.json(new ApiResponse(200, playlists, "Successfully get user playlist"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
   const { playlistId } = req.params;

   const playlist = await PlaylistService.findPlaylistById(playlistId);
   if (!playlist) throw new ApiError(404, "Playlist not found");

	res
		.status(200)
		.json(new ApiResponse(200, playlist, "Successfully get playlist"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
   const { playlistId , videoId } = req.params;

   const playlist = await PlaylistService.findPlaylistById(playlistId);
   if (!playlist) throw new ApiError(404, "Playlist not found");

   const video = await PlaylistService.findVideoById(videoId);
   if (!video) throw new ApiError(404, "Video not found");

   const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
   if (!isOwner) throw new ApiError(403, "You are not authorized to delete this playlist");

	const updatedPlaylist = await PlaylistService.addVideoToPlaylistService(playlist, video);

	if (updatedPlaylist.message)
		return res
			.status(200)
			.json(new ApiResponse(200, updatedPlaylist.playlist, updatedPlaylist.message));

	return res
		.status(200)
		.json(
			new ApiResponse(200, updatedPlaylist, "Successfully added video to playlist"),
		);
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
   const { playlistId , videoId } = req.params;

   const playlist = await PlaylistService.findPlaylistById(playlistId);
   if (!playlist) throw new ApiError(404, "Playlist not found");

   const video = await PlaylistService.findVideoById(videoId);
   if (!video) throw new ApiError(404, "Video not found");

   const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
   if (!isOwner) throw new ApiError(403, "You are not authorized to delete this playlist");

	const updatedPlaylist = await PlaylistService.removeVideoFromPlaylistService(
		playlist,
		video,
	);
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

   const playlist = await PlaylistService.findPlaylistById(playlistId);
   if (!playlist) throw new ApiError(404, "Playlist not found");

   const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
   if (!isOwner) throw new ApiError(403, "You are not authorized to delete this playlist");

	await PlaylistService.deletePlaylistService(playlist);
	return res.status(204).end();
});

const updatePlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
   const { playlistId } = req.params;

   const playlist = await PlaylistService.findPlaylistById(playlistId);
   if (!playlist) throw new ApiError(404, "Playlist not found");

   const isOwner = await PlaylistService.isPlaylistOwner(playlist, req.user);
   if (!isOwner) throw new ApiError(403, "You are not authorized to delete this playlist");

	const updatedPlaylist = await PlaylistService.updatePlaylistService(
		playlist,
		name,
		description,
		req?.file?.path,
	);

	return res
		.status(200)
		.json(new ApiResponse(200, updatedPlaylist, "Successfully updated playlist"));
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
