import mongoose from "mongoose";
import { ApiError } from "../../utils/apiErrors.js";
import { serviceHandler } from "../../utils/handlers.js";
import { User } from "../user/user.models.js";
import { Video } from "../video/video.models.js";
import { Playlist } from "./playlist.models.js";

export const createPlaylistService = serviceHandler(
	async (name, description, userMeta) => {
		const playlist = await Playlist.create({
			name,
			description,
			owner: userMeta._id,
		});
		return playlist;
	}
);

export const getUserPlaylistsService = serviceHandler(async (userId) => {
	const playlists = await User.aggregate([
		{ $match: { _id: new Video.Types.ObjectId(userId) } },
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
	return playlists;
});

export const addVideoToPlaylistService = serviceHandler(
	async (playlistMeta, videoMeta) => {
		if (playlistMeta.videos.includes(videoMeta._id.toString())) {
			const playlist = await Playlist.aggregate(aggregationPipeline);
			return res
				.status(200)
				.json(new ApiResponse(200, playlist, "Video already in playlist"));
		}

		const playlist = await Playlist.findByIdAndUpdate(
			playlistMeta._id,
			{
				$push: { videos: new mongoose.Types.ObjectId(videoMeta._id) },
				$set: { thumbnail: playlistMeta.thumbnail || videoMeta.thumbnail },
			},
			{ new: true }
		);
		return playlist;
	}
);

export const removeVideoFromPlaylistService = serviceHandler(
	async (playlistMeta, videoMeta) => {
		if (!playlistMeta.videos.includes(videoMeta._id.toString()))
			throw new ApiError(422, "Video not found in playlist");

		const updatedPlaylist = await Playlist.findByIdAndUpdate(
			playlistMeta._id,
			{ $pull: { videos: videoMeta._id } },
			{ new: true }
		);

		if (
			playlistMeta.thumbnail === videoMeta.thumbnail &&
			updatedPlaylist.videos.length > 0
		) {
			updatedPlaylist.thumbnail = updatedPlaylist.videos[0].thumbnail;
			await updatedPlaylist.save();
		} else if (updatedPlaylist.videos.length === 0) {
			updatedPlaylist.thumbnail = null;
			await updatedPlaylist.save();
		}

		return updatedPlaylist;
	}
);

export const deletePlaylistService = serviceHandler(async (playlistMeta) => {
	await Playlist.findByIdAndDelete(playlistMeta._id);
});

export const updatedPlaylistService = serviceHandler(
	async (playlistMeta, name, description) => {
		const playlist = await Playlist.findByIdAndUpdate(
			playlistMeta._id,
			{ name, description },
			{ new: true }
		);

		return playlist;
	}
);
