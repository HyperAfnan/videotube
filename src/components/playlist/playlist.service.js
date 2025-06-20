import { Video } from "../video/video.model.js";
import mongoose from "mongoose";
import { ApiError } from "../../utils/apiErrors.js";
import { serviceHandler } from "../../utils/handlers.js";
import { User } from "../user/user.model.js";
import { Playlist } from "./playlist.model.js";
import {
	deleteImageOnCloudinary,
	uploadImageOnCloudinary,
} from "../../utils/fileHandlers.js";
import { logger } from "../../utils/logger/index.js";
const playlistLogger = logger.child({ module: "playlist.service" });

export const findVideoById = serviceHandler(async (videoId) => {
	const video = await Video.findById(videoId);
	return video;
});

export const findPlaylistById = serviceHandler(async (playlistId) => {
	const playlist = await Playlist.findById(playlistId);
	return playlist;
});

export const findUserById = serviceHandler(async (userId) => {
	const user = await User.findById(userId);
	return user;
});

export const isPlaylistOwner = serviceHandler(
	async (playlistMeta, userMeta) => {
		return playlistMeta.owner.toString() === userMeta._id.toString();
	},
);

export const createPlaylistService = serviceHandler(
	async (name, description, userMeta) => {
		playlistLogger.info("Creating playlist", {
			name,
			description,
			ownerId: userMeta._id,
		});
		const playlist = await Playlist.create({
			name,
			description,
			owner: userMeta._id,
		});
		playlistLogger.info("Playlist created", {
			playlistId: playlist._id,
			ownerId: userMeta._id,
		});
		return playlist;
	},
);

export const getUserPlaylistsService = serviceHandler(async (userId) => {
	playlistLogger.info("Fetching playlists for user", { userId });
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
	playlistLogger.info("Fetched user playlists", {
		userId,
		playlistCount: playlists[0]?.playlists?.length,
	});
	return playlists;
});

export const addVideoToPlaylistService = serviceHandler(
	async (playlistMeta, videoMeta) => {
		playlistLogger.info("Adding video to playlist", {
			playlistId: playlistMeta._id,
			videoId: videoMeta._id,
		});
		if (playlistMeta.videos.includes(videoMeta._id.toString())) {
			throw new ApiError(422, "Video already exists in the playlist", {
				playlistId: playlistMeta._id,
				videoId: videoMeta._id,
			});
		}

		const updateOps = {
			$push: { videos: new mongoose.Types.ObjectId(String(videoMeta._id)) },
		};
		if (!playlistMeta.thumbnail)
			updateOps.$set = { thumbnail: videoMeta.thumbnail };
		const playlist = await Playlist.findByIdAndUpdate(
			playlistMeta._id,
			updateOps,
			{ new: true },
		);

		playlistLogger.info("Video added to playlist", {
			playlistId: playlistMeta._id,
			videoId: videoMeta._id,
		});
		return playlist;
	},
);

export const removeVideoFromPlaylistService = serviceHandler(
	async (playlistMeta, videoMeta) => {
		playlistLogger.info("Removing video from playlist", {
			playlistId: playlistMeta._id,
			videoId: videoMeta._id,
		});
		if (!playlistMeta.videos.includes(videoMeta._id.toString())) {
			throw new ApiError(422, "Video not found in playlist", {
				playlistId: playlistMeta._id,
				videoId: videoMeta._id,
			});
		}

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
			playlistLogger.info("Updated playlist thumbnail after removal", {
				playlistId: playlistMeta._id,
				newThumbnail: updatedPlaylist.thumbnail,
			});
		} else if (updatedPlaylist.videos.length === 0) {
			updatedPlaylist.thumbnail = null;
			await updatedPlaylist.save();
			playlistLogger.info("Cleared playlist thumbnail after last removal", {
				playlistId: playlistMeta._id,
			});
		}

		playlistLogger.info("Video removed from playlist", {
			playlistId: playlistMeta._id,
			videoId: videoMeta._id,
		});
		return updatedPlaylist;
	},
);

export const deletePlaylistService = serviceHandler(async (playlistMeta) => {
	playlistLogger.info("Deleting playlist", { playlistId: playlistMeta._id });
	await Playlist.findByIdAndDelete(playlistMeta._id);
	playlistLogger.info("Playlist deleted", { playlistId: playlistMeta._id });
});

export const updatePlaylistService = serviceHandler(
	async (playlistMeta, name, description, thumbnailLocalPath) => {
		let thumbnail;
		if (thumbnailLocalPath) {
			playlistLogger.info("Updating playlist thumbnail", {
				playlistId: playlistMeta._id,
				previousThumbnail: playlistMeta.thumbnail,
			});
			await deleteImageOnCloudinary(playlistMeta.thumbnail).catch((e) => {
				playlistLogger.error("Unable to delete old thumbnail", {
					playlistId: playlistMeta._id,
					error: e,
				});
				throw new ApiError(500, "Unable to delete old thumbnail", e);
			});
			thumbnail = await uploadImageOnCloudinary(thumbnailLocalPath).catch(
				(e) => {
					playlistLogger.error("Unable to upload new thumbnail", {
						playlistId: playlistMeta._id,
						error: e,
					});
					throw new ApiError(500, "Unable to upload new thumbnail", e);
				},
			);
		}

		const playlist = await Playlist.findByIdAndUpdate(
			playlistMeta._id,
			{ name, description, thumbnail: thumbnail?.secure_url },
			{ new: true },
		);

		playlistLogger.info("Playlist updated", {
			playlistId: playlistMeta._id,
			name,
			description,
			newThumbnail: thumbnail?.secure_url,
		});
		return playlist;
	},
);
