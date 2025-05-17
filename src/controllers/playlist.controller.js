import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
	//TODO: create playlist
	const { name, description } = req.body;

	if (!name || !description)
		throw new ApiError(402, "Name and description are required");

	const playlist = await Playlist.create({
		name,
		description,
		owner: req.user._id,
	});

	res
		.status(200)
		.json(new ApiResponse(200, playlist, "Successfully created playlist"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
	//TODO: get user playlists
	const { userId } = req.params;

	if (!userId) throw new ApiError(402, "userid is required");
	if (!isValidObjectId(userId)) throw new ApiError(402, "invalid userid");

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

	res
		.status(200)
		.json(new ApiResponse(200, playlists, "Successfully get user playlist"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
	//TODO: get playlist by id
	const { playlistId } = req.params;

	if (!playlistId) throw new ApiError(402, "playlistid is required");
	if (!isValidObjectId(playlistId))
		throw new ApiError(402, "invalid playlistid");

	const playlist = await Playlist.findById(playlistId);

	if (!playlist) throw new ApiError(404, "playlist not found");

	res
		.status(200)
		.json(new ApiResponse(200, playlist, "Successfully get playlist"));
});

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
		throw new ApiError(404, "playlist not found");

	const aggregationPipeline = [
		{ $match: { _id: new mongoose.Types.ObjectId(playlistId) } },
		{
			$lookup: {
				from: "videos",
				localField: "videos",
				foreignField: "_id",
				as: "videos",
				pipeline: [
					{
						$lookup: {
							from: "users",
							localField: "owner",
							foreignField: "_id",
							as: "owner",
							pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }],
						},
					},
				],
			},
		},
	];

	if (playlist.videos.includes(video._id.toString())) {
		const playlist = await Playlist.aggregate(aggregationPipeline);
		return res
			.status(200)
			.json(new ApiResponse(200, playlist, "Video already in playlist"));
	}

	await Playlist.updateOne(
		{ _id: playlistId },
		{ $push: { videos: new mongoose.Types.ObjectId(videoId) } }
	);

	const updatedPlaylist = await Playlist.aggregate(aggregationPipeline);
	if (!updatedPlaylist[0].thumbnail) {
		const thumbnail = updatedPlaylist[0].videos[0].thumbnail;
		await Playlist.findByIdAndUpdate(playlistId, { thumbnail });
	}

	res
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
	// TODO: remove video from playlist

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
		throw new ApiError(404, "playlist not found");

	if (!playlist.videos.includes(video._id.toString())) throw new ApiError(404, "Video not found in playlist")

	const aggregationPipeline = [
		{ $match: { _id: new mongoose.Types.ObjectId(playlistId) } },
		{
			$lookup: {
				from: "videos",
				localField: "videos",
				foreignField: "_id",
				as: "videos",
			},
		},
	];

   const newPlaylist = await Playlist.aggregate(aggregationPipeline)

   if (newPlaylist[0].videos[0]._id.toString() === video._id.toString()) {
		const thumbnail = newPlaylist[0].videos[1].thumbnail;
		await Playlist.findByIdAndUpdate(playlistId, { thumbnail });
   }

	await Playlist.updateOne(
		{ _id: playlistId },
		{ $pull: { videos: new mongoose.Types.ObjectId(videoId) } }
	);

	res
		.status(200)
		.json(new ApiResponse(200, {}, "Successfully removed video from playlist"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
	// TODO: delete playlist
	const { playlistId } = req.params;

	if (!playlistId) throw new ApiError(400, "playlistid is required");
	if (!isValidObjectId(playlistId)) throw new ApiError(400, "Bad request");

	const playlist = await Playlist.findById(playlistId);
	if (!playlist) throw new ApiError(404, "Playlist not found");
	if (playlist.owner.toString() !== req.user._id.toString())
		throw new ApiError(404, "playlist not found");

	await Playlist.findByIdAndDelete(playlistId);

	res
		.status(200)
		.json(new ApiResponse(200, {}, "Successfully deleted playlist"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
	//TODO: update playlist
	const { playlistId } = req.params;
	const { name, description } = req.body;

	if (!playlistId) throw new ApiError(400, "playlistid is required");
	if (!isValidObjectId(playlistId)) throw new ApiError(400, "Bad request");

	const playlist = await Playlist.findById(playlistId);
	if (!playlist) throw new ApiError(404, "Playlist not found");
	if (playlist.owner.toString() !== req.user._id.toString())
		throw new ApiError(404, "playlist not found");

	const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId, {
		name,
		description,
	});

	res
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
