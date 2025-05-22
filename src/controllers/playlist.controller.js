import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
	const { name, description } = req.body;

	if (!name || !description)
		throw new ApiError(400, "Name and description are required");

	const playlist = await Playlist.create({
		name,
		description,
		owner: req.user._id,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, playlist, "Successfully created playlist"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	if (!userId) throw new ApiError(400, "userid is required");
	if (!isValidObjectId(userId)) throw new ApiError(400, "invalid userid");

	const playlists = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(userId) } },
		{
			$lookup: {
				from: "playlists",
				localFields: "_id",
				foreignField: "owner",
				as: "playlists",
			},
		},
		{ $project: { name: 1, playlists: 1 } },
	]);

	return res
		.status(200)
		.json(new ApiResponse(200, playlists, "Successfully get user playlist"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;

	if (!playlistId) throw new ApiError(400, "playlistid is required");
	if (!isValidObjectId(playlistId))
		throw new ApiError(400, "invalid playlistid");

	const playlist = await Playlist.findById(playlistId);

	if (!playlist) throw new ApiError(404, "playlist not found");

	return res
		.status(200)
		.json(new ApiResponse(200, playlist, "Successfully get playlist"));
});

// TODO: test this method
const addVideoToPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req.params;

	if (!playlistId || !videoId)
		throw new ApiError(400, "Both playlistid and videoId are required");
	if (!isValidObjectId(playlistId)) throw new ApiError(400, "Bad request");
	if (!isValidObjectId(videoId)) throw new ApiError(400, "Bad request");

	const playlist = await Playlist.findById(playlistId);
	const video = await Video.findById(videoId);
	if (!playlist) throw new ApiError(404, "playlist not found");
	if (!video) throw new ApiError(404, "video not found");

	if (playlist.owner.toString() !== req.user._id.toString())
		throw new ApiError(403, "Unauthorized to update playlist");

	// check if video is already in playlist
	if (playlist.videos.includes(video._id.toString())) {
		const playlist = await Playlist.aggregate(aggregationPipeline);
		return res
			.status(200)
			.json(new ApiResponse(200, playlist, "Video already in playlist"));
	}

	// updates playlist data and adds playlist thumbnail if not present to video thumbnail
	const updatedPlaylist = await Playlist.findByIdAndUpdate(
		playlist._id,
		{
			$push: { videos: new mongoose.Types.ObjectId(videoId) },
			$set: { thumbnail: playlist.thumbnail || video.thumbnail },
		},
		{ new: true }
	);

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				updatedPlaylist,
				"Successfully added video to playlist"
			)
		);
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
	const { playlistId, videoId } = req.params;

	if (!playlistId || !videoId)
		throw new ApiError(400, "Both playlistid and videoId are required");
	if (!isValidObjectId(playlistId)) throw new ApiError(400, "Bad request");
	if (!isValidObjectId(videoId)) throw new ApiError(400, "Bad request");

	const playlist = await Playlist.findById(playlistId);
	const video = await Video.findById(videoId);
	if (!playlist) throw new ApiError(404, "playlist not found");
	if (!video) throw new ApiError(404, "video not found");

	if (playlist.owner.toString() !== req.user._id.toString())
		throw new ApiError(403, "Unauthorized to update playlist");

	if (!playlist.videos.includes(video._id.toString()))
		throw new ApiError(422, "Video not found in playlist");

	const updatedPlaylist = await Playlist.findByIdAndUpdate(
		playlistId,
		{ $pull: { videos: videoId } },
		{ new: true }
	);

	if (
		playlist.thumbnail === video.thumbnail &&
		updatedPlaylist.videos.length > 0
	) {
		updatedPlaylist.thumbnail = updatedPlaylist.videos[0].thumbnail;
		await updatedPlaylist.save();
	} else if (updatedPlaylist.videos.length === 0) {
		updatedPlaylist.thumbnail = null;
		await updatedPlaylist.save();
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				updatedPlaylist,
				"Successfully removed video from playlist"
			)
		);
});

const deletePlaylist = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;

	if (!playlistId) throw new ApiError(400, "playlistid is required");
	if (!isValidObjectId(playlistId)) throw new ApiError(400, "Bad request");

	const playlist = await Playlist.findById(playlistId);
	if (!playlist) throw new ApiError(404, "Playlist not found");
	if (playlist.owner.toString() !== req.user._id.toString())
		throw new ApiError(403, "Unauthorized to delete playlist");

	await Playlist.findByIdAndDelete(playlistId);

	return res.status(204).end();
});

const updatePlaylist = asyncHandler(async (req, res) => {
	const { playlistId } = req.params;
	const { name, description } = req.body;

	if (!playlistId) throw new ApiError(400, "playlistid is required");
	if (!isValidObjectId(playlistId)) throw new ApiError(400, "Bad request");

	const playlist = await Playlist.findById(playlistId);
	if (!playlist) throw new ApiError(404, "Playlist not found");
	if (playlist.owner.toString() !== req.user._id.toString())
		throw new ApiError(402, "Unauthorized to update playlist");

	const updatedPlaylist = await Playlist.findByIdAndUpdate(
		playlistId,
		{
			name,
			description,
		},
		{ new: true }
	);

	return res
		.status(200)
		.json(
			new ApiResponse(200, updatedPlaylist, "Successfully updated playlist")
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
