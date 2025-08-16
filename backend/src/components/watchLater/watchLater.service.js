import { serviceHandler } from "../../utils/handlers.js";
import { User } from "../user/user.model.js";
import { WatchLater } from "./watchLater.model.js";
import { Video } from "../video/video.model.js";
import { logger } from "../../utils/logger/index.js";
import mongoose from "mongoose";
const watchLaterService = logger.child({ module: "watchLater.services" });

export const findUserById = serviceHandler(async (userId) => {
	const user = await User.findById(userId);
	return user;
});

export const findVideoById = serviceHandler(async (videoId) => {
	const video = await Video.findById(videoId);
	return video;
});

export const isVideoInWatchLater = serviceHandler(async (videoId, userId) => {
	const watchLater = await WatchLater.findOne({
		video: videoId,
		user: userId,
	});
	return watchLater;
});

export const addToWatchLaterService = serviceHandler(
	async (videoId, userId) => {
		watchLaterService.info("Adding video to watch later", {
			videoId,
			userId,
		});
		const watchLater = await WatchLater.create({
			video: videoId,
			user: userId,
		});

		const watchLaterVideos = await WatchLater.aggregate([
			{ $match: { _id: new mongoose.Types.ObjectId(String(watchLater?._id)) } },
			{
				$lookup: {
					from: "videos",
					localField: "video",
					foreignField: "_id",
					as: "video",
					pipeline: [
						{
							$lookup: {
								from: "users",
								localField: "owner",
								foreignField: "_id",
								as: "owner",
								pipeline: [{ $project: { username: 1, _id: 1, avatar: 1 } }],
							},
						},
						{ $unwind: "$owner" },
						{
							$project: {
								title: 1,
								thumbnail: 1,
								_id: 1,
								duration: 1,
								owner: 1,
								views: 1,
								createdAt: 1,
							},
						},
					],
				},
			},
			{ $unwind: { path: "$video", preserveNullAndEmptyArrays: false } },
			{ $match: { "video._id": { $exists: true } } },
			{ $project: { _id: 1, user: 1, video: 1, updatedAt: 1, createdAt: 1 } },
		]);
		watchLaterService.info("Video added to watch later successfully", {
			videoId,
			userId,
			watchLaterVideosCount: watchLaterVideos.length,
		});
		return { watchLater, watchLaterVideos };
	},
);

export const removeFromWatchLaterService = serviceHandler(
	async (videoId, userId) => {
		watchLaterService.info("Remove video from watch later", {
			videoId,
			userId,
		});
		const watchLater = await WatchLater.findOneAndDelete({
			video: videoId,
			user: userId,
		});
		return watchLater;
	},
);

export const getWatchLaterVideosService = serviceHandler(async (userId) => {
	watchLaterService.info("Fetching watch later videos for user", {
		userId,
	});

	const watchLaterVideos = await WatchLater.aggregate([
		{ $match: { user: new mongoose.Types.ObjectId(String(userId)) } },
		{
			$lookup: {
				from: "videos",
				localField: "video",
				foreignField: "_id",
				as: "video",
				pipeline: [
					{
						$lookup: {
							from: "users",
							localField: "owner",
							foreignField: "_id",
							as: "owner",
							pipeline: [{ $project: { username: 1, _id: 1, avatar: 1 } }],
						},
					},
					{ $unwind: "$owner" },
					{
						$project: {
							title: 1,
							thumbnail: 1,
							_id: 1,
							duration: 1,
							owner: 1,
							views: 1,
							createdAt: 1,
						},
					},
				],
			},
		},
		{ $unwind: "$video" },
		{ $project: { _id: 1, user: 1, video: 1, updatedAt: 1, createdAt: 1 } },
	]);

	return watchLaterVideos;
});

export const deleteAllWatchLaterVideosService = serviceHandler(
	async (userId) => {
		watchLaterService.info("Deleting all watch later videos for user", {
			userId,
		});
		const result = await WatchLater.deleteMany({ user: userId });

		watchLaterService.info("All watch later videos deleted successfully", {
			userId,
			deletedCount: result.deletedCount,
		});
		return result;
	},
);
