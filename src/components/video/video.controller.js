import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as VideoService from "./video.service.js";
import { logger } from "../../utils/logger/index.js";
const videoLogger = logger.child({ module: "video.controllers" });

const getAllVideos = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, q, sortBy, sortType, userId } = req.query;

	videoLogger.info("Fetching all videos", { page, limit, q, sortBy, sortType, userId: userId || req.user._id });

	if (userId) {
		const user = await VideoService.findUserById(userId);
		if (!user) {
			videoLogger.warn("User not found when fetching videos", { userId });
			throw new ApiError(404, "User not found");
		}
	}

	const user = userId || req.user._id;

	const allVideos = await VideoService.getAllVideos(
		page,
		limit,
		q,
		sortBy,
		sortType,
		user,
	);

	videoLogger.info("Fetched videos successfully", { count: allVideos.length, user });

	return res
		.status(200)
		.json(new ApiResponse(200, allVideos, "successfully got all videos"));
});

const publishAVideo = asyncHandler(async (req, res) => {
	const { title, description } = req.body;
	const videoFileLocalPath = req.files.videoFile[0].path;
	const thumbnailLocalPath = req.files.thumbnail[0].path;

	videoLogger.info("Publishing a new video", { title, userId: req.user._id });

	const video = await VideoService.publishVideo(
		title,
		description,
		req.user,
		videoFileLocalPath,
		thumbnailLocalPath,
	);

	videoLogger.info("Video published successfully", { videoId: video._id, userId: req.user._id });

	return res
		.status(201)
		.json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
	const { videoId } = req.params;

	videoLogger.info("Fetching video by ID", { videoId, userId: req.user._id });

	const video = await VideoService.findVideoById(videoId);
	if (!video) {
		videoLogger.warn("Video not found", { videoId });
		throw new ApiError(404, "Video not found");
	}

	const userVideo = await VideoService.getUserVideoById(
		videoId,
		video,
		req.user._id,
	);

	videoLogger.info("Fetched video successfully", { videoId });

	return res
		.status(200)
		.json(new ApiResponse(200, userVideo, "successfully got video"));
});

const updateVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	const { description, title } = req.body;

	videoLogger.info("Updating video", { videoId, userId: req.user._id });

	const video = await VideoService.findVideoById(videoId);
	if (!video) {
		videoLogger.warn("Video not found for update", { videoId });
		throw new ApiError(404, "Video not found");
	}

	const isOwner = VideoService.isVideoOwner(video, req.user);
	if (!isOwner) {
		videoLogger.warn("Not authorized to update video", { videoId, userId: req.user._id });
		throw new ApiError(403, "Not authorized to perform this operation");
	}

	const updatedVideo = await VideoService.updateVideo(
		title,
		description,
		video,
		videoId,
		req?.file?.path,
	);

	videoLogger.info("Video updated successfully", { videoId });

	return res
		.status(200)
		.json(new ApiResponse(200, updatedVideo, "successfully updated video"));
});

const deleteVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;

	videoLogger.info("Deleting video", { videoId, userId: req.user._id });

	const video = await VideoService.findVideoById(videoId);
	if (!video) {
		videoLogger.warn("Video not found for deletion", { videoId });
		throw new ApiError(404, "Video not found");
	}

	const isOwner = VideoService.isVideoOwner(video, req.user);
	if (!isOwner) {
		videoLogger.warn("Not authorized to delete video", { videoId, userId: req.user._id });
		throw new ApiError(403, "Not authorized to perform this operation");
	}

	await VideoService.deleteVideo(video);

	videoLogger.info("Video deleted successfully", { videoId });

	return res.status(204).end();
});

const downloadVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	videoLogger.info("Downloading video", { videoId, userId: req.user._id });

	const video = await VideoService.findVideoById(videoId);
	if (!video) {
		videoLogger.warn("Video not found for download", { videoId });
		throw new ApiError(404, "Video not found");
	}

	videoLogger.info("Redirecting to video file", { videoId, videoFile: video.videoFile });

	res.redirect(video.videoFile);
});

const togglePublishStatus = asyncHandler(async (req, res) => {
	const { videoId } = req.params;

	videoLogger.info("Toggling publish status", { videoId, userId: req.user._id });

	const video = await VideoService.findVideoById(videoId);
	if (!video) {
		videoLogger.warn("Video not found for toggling status", { videoId });
		throw new ApiError(404, "Video not found");
	}

	const isOwner = VideoService.isVideoOwner(video, req.user);
	if (!isOwner) {
		videoLogger.warn("Not authorized to toggle publish status", { videoId, userId: req.user._id });
		throw new ApiError(403, "Not authorized to perform this operation");
	}

	const updateVideo = await VideoService.togglePublishStatus(video);

	videoLogger.info("Publish status toggled successfully", { videoId, isPublished: updateVideo.isPublished });

	return res
		.status(200)
		.json(
			new ApiResponse(200, updateVideo, "successfully toggled publish status"),
		);
});

export {
	getAllVideos,
	publishAVideo,
	getVideoById,
	updateVideo,
	deleteVideo,
	downloadVideo,
	togglePublishStatus,
};
