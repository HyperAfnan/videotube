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
	const user = userId || req.user._id;
	const playlists = await PlaylistService.getUserPlaylistsService(user);
	return res
		.status(200)
		.json(new ApiResponse(200, playlists, "Successfully get user playlist"));
});

const getPlaylistById = asyncHandler(async (req, res) =>
	res
		.status(200)
		.json(new ApiResponse(200, req.playlist, "Successfully get playlist")),
);

// TODO: test this method
const addVideoToPlaylist = asyncHandler(async (req, res) => {
	const updatedPlaylist = await PlaylistService.addVideoToPlaylistService(
		req.playlist,
		req.video,
	);
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
	const updatedPlaylist = await PlaylistService.removeVideoFromPlaylistService(
		req.playlist,
		req.video,
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
	await PlaylistService.deletePlaylistService(req.playlist);
	return res.status(204).end();
});

const updatePlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;
	const updatedPlaylist = await PlaylistService.updatePlaylistService(
		req.playlist,
		name,
		description,
	);
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
