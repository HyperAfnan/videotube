import { asyncHandler } from "../../utils/handlers.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { ApiError } from "../../utils/apiErrors.js";
import { logger } from "../../utils/logger/index.js";
const watchLaterController = logger.child({ module: "watchLater.controller" });
import * as WatchLaterService from "./watchLater.service.js";

export const addToWatchLater = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	const userId = req.user._id;

	const isVideoIdValid = await WatchLaterService.findVideoById(videoId);
	if (!isVideoIdValid) throw new ApiError(400, "Invalid video ID");

	const isAlreadyAdded = await WatchLaterService.isVideoInWatchLater(
		videoId,
		userId,
	);
	if (isAlreadyAdded)
		throw new ApiError(400, "Video already added to watchLater");

	watchLaterController.info("Adding video to watch later", {
		videoId,
		userId,
	});

	const { watchLater, watchLaterVideos } =
		await WatchLaterService.addToWatchLaterService(videoId, userId);
	if (!watchLater) throw new ApiError(500, "Error Adding Video to watchLater");

	return res
		.status(201)
		.json(
			new ApiResponse(
				201,
				watchLaterVideos[0],
				"Video added to watch later successfully",
			),
		);
});

export const removeFromWatchLater = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	const userId = req.user._id;

	const isVideoIdValid = await WatchLaterService.findVideoById(videoId);
	if (!isVideoIdValid) throw new ApiError(400, "Invalid video ID");

	const isAlreadyAdded = await WatchLaterService.isVideoInWatchLater(
		videoId,
		userId,
	);
	if (!isAlreadyAdded)
		throw new ApiError(400, "Video not found in Watch Later");

	watchLaterController.info("Removing video from watch later", {
		videoId,
		userId,
	});

	const watchLater = await WatchLaterService.removeFromWatchLaterService(
		videoId,
		userId,
	);
	if (!watchLater)
		throw new ApiError(500, "Error Removing video from watchLater");

	return res
		.status(201)
		.json(
			new ApiResponse(
				201,
				watchLater,
				"Video removed from watch later successfully",
			),
		);
});

export const getWatchLaterVideos = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	watchLaterController.info("Fetching watch later videos for user", {
		userId,
	});

	const watchLaterVideos =
		await WatchLaterService.getWatchLaterVideosService(userId);
	if (!watchLaterVideos || watchLaterVideos.length === 0) {
		return res
			.status(200)
			.json(new ApiResponse(200, [], "No watch later videos found"));
	}
	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				watchLaterVideos,
				"Watch later videos fetched successfully",
			),
		);
});

export const deleteAllWatchLaterVideos = asyncHandler(async (req, res) => {
	const userId = req.user._id;

	watchLaterController.info("Deleting all watch later videos for user", {
		userId,
	});

	const deletedCount =
		await WatchLaterService.deleteAllWatchLaterVideosService(userId);
	if (deletedCount === 0) {
		return res
			.status(404)
			.json(new ApiResponse(404, [], "No watch later videos to delete"));
	}

	return res.status(204).end();
});
