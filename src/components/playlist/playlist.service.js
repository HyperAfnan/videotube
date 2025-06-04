import mongoose from "mongoose";
import { ApiError } from "../../utils/apiErrors.js";
import { serviceHandler } from "../../utils/handlers.js";
import { User } from "../user/user.models.js";
import { Playlist } from "./playlist.models.js";
import {
	uploadImageOnCloudinary,
	deleteImageOnCloudinary,
} from "../../utils/fileHandlers.js";

export const createPlaylistService = serviceHandler(
	async (name, description, userMeta) => {
		const playlist = await Playlist.create({
			name,
			description,
			owner: userMeta._id,
		});
		return playlist;
	},
);

export const getUserPlaylistsService = serviceHandler(async (userId) => {
	const playlists = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(String(userId)) } },
		{
			$lookup: {
				from: "playlists",
				localField: "_id",
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
		if (playlistMeta.videos.includes(videoMeta._id.toString()))
			return {
				playlist: playlistMeta,
				message: "Video already exists in the playlist",
			};

      const updateOps = { $push: { videos: new mongoose.Types.ObjectId(String(videoMeta._id)) } };
      if (!playlistMeta.thumbnail) updateOps.$set = { thumbnail: videoMeta.thumbnail };
      const playlist = await Playlist.findByIdAndUpdate( playlistMeta._id, updateOps, { new: true });

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
			{ new: true },
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
	},
);

export const deletePlaylistService = serviceHandler(async (playlistMeta) => {
	await Playlist.findByIdAndDelete(playlistMeta._id);
});

export const updatePlaylistService = serviceHandler(
	async (playlistMeta, name, description, thumbnailLocalPath) => {
		let thumbnail;
		if (thumbnailLocalPath) {
			await deleteImageOnCloudinary(playlistMeta.thumbnail).catch((e) => {
				throw new ApiError(500, "Unable to delete old thumbnail", e);
			});
			thumbnail = await uploadImageOnCloudinary(thumbnailLocalPath).catch(
				(e) => {
					throw new ApiError(500, "Unable to upload new thumbnail", e);
				},
			);
		}

		const playlist = await Playlist.findByIdAndUpdate(
			playlistMeta._id,
			{ name, description, thumbnail: thumbnail?.secure_url },
			{ new: true },
		);

		return playlist;
	},
);
