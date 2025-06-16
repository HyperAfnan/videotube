import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as VideoService from "./video.service.js";

const getAllVideos = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, q, sortBy, sortType, userId } = req.query;

   if (userId) {
      const user = await VideoService.findUserById(userId);
      if (!user) throw new ApiError(404, "User not found")
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

	return res
		.status(200)
		.json(new ApiResponse(200, allVideos, "successfully got all videos"));
});

const publishAVideo = asyncHandler(async (req, res) => {
	const { title, description } = req.body;
	const videoFileLocalPath = req.files.videoFile[0].path;
	const thumbnailLocalPath = req.files.thumbnail[0].path;
	const video = await VideoService.publishVideo(
		title,
		description,
      req.user,
		videoFileLocalPath,
		thumbnailLocalPath,
	);

	return res
		.status(201)
		.json(new ApiResponse(201, video, "User registered successfully "));
});

const getVideoById = asyncHandler(async (req, res) => {
	const { videoId } = req.params;

   const video = await VideoService.findVideoById(videoId)
   if (!video) throw new ApiError(404, "Video not found")

	const userVideo = await VideoService.getUserVideoById(videoId, video, req.user._id);

	return res
		.status(200)
		.json(new ApiResponse(200, userVideo, "successfully got video"));
});

const updateVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	const { description, title } = req.body;

   const video = await VideoService.findVideoById(videoId)
   if (!video) throw new ApiError(404, "Video not found")

   const isOwner = VideoService.isVideoOwner(video, req.user)
   if (!isOwner) throw new ApiError(403, "Not authorized to perform this operation")

	const updatedVideo = await VideoService.updateVideo(
		title,
		description,
      video,
		videoId,
      req?.file?.path,
	);

	return res
		.status(200)
		.json(new ApiResponse(200, updatedVideo, "successfully updated video"));
});

const deleteVideo = asyncHandler(async (req, res) => {
   const  { videoId } = req.params

   const video = await VideoService.findVideoById(videoId)
   if (!video) throw new ApiError(404, "Video not found")

   const isOwner = VideoService.isVideoOwner(video, req.user)
   if (!isOwner) throw new ApiError(403, "Not authorized to perform this operation")

	await VideoService.deleteVideo(video);

	return res.status(204).end();
});

const downloadVideo = asyncHandler(async (req, res) => {
   const { videoId } = req.params

   const video = await VideoService.findVideoById(videoId)
   if (!video) throw new ApiError(404, "Video not found")

	res.redirect(video.videoFile)
});

const togglePublishStatus = asyncHandler(async (req, res) => {
   const { videoId } = req.params

   const video = await VideoService.findVideoById(videoId)
   if (!video) throw new ApiError(404, "Video not found")

   const isOwner = VideoService.isVideoOwner(video, req.user)
   if (!isOwner) throw new ApiError(403, "Not authorized to perform this operation")

	const updateVideo = await VideoService.togglePublishStatus(video);

	return res
		.status(200)
		.json(new ApiResponse(200, updateVideo, "successfully toggled publish status"));
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
