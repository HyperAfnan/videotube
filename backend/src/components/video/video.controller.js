import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as VideoService from "./video.service.js";
import { logger } from "../../utils/logger/index.js";
const videoLogger = logger.child({ module: "video.controllers" });

const getAllVideos = asyncHandler(async (req, res) => {
   const { page = 1, limit = 10, q = "", sortBy, sortType, userId } = req.query;

   videoLogger.info(`[Request] ${req.id} Fetching all videos`, {
      page,
      limit,
      q,
      sortBy,
      sortType,
      userId: userId || req.user._id,
   });

   if (userId) {
      const user = await VideoService.findUserById(userId);
      if (!user) {
         throw new ApiError(404, "User not found", { userId, requestId: req.id });
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

   videoLogger.info(`[Request] ${req.id} Fetched videos successfully`, {
      count: allVideos.length,
      user,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, allVideos, "successfully got all videos"));
});

const publishAVideo = asyncHandler(async (req, res) => {
   const requestId = req.id;
   const title = crypto.randomUUID();
   const description = crypto.randomUUID();
   const { visiblity = "private", isPublished = false } = req.body;
   // const { title, description } = req.body;
   const videoFileLocalPath = req.files.videoFile[0].path;
   // const thumbnailLocalPath = req.files.thumbnail[0].path;

   videoLogger.info(`[Request] ${requestId} Publishing a new video`, {
      title,
      userId: req.user._id,
   });

   const video = await VideoService.publishVideo(
      title,
      description,
      req.user,
      videoFileLocalPath,
      visiblity,
      isPublished,
      // thumbnailLocalPath,
   );

   videoLogger.info(`[Request] ${requestId} Video published successfully`, {
      videoId: video._id,
      userId: req.user._id,
   });

   return res
      .status(201)
      .json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
   const requestId = req.id;
   const { videoId } = req.params;

   videoLogger.info(`[Request] ${requestId} Fetching video by ID`, {
      videoId,
      userId: req.user._id,
   });

   const video = await VideoService.findVideoById(videoId);
   if (!video) {
      throw new ApiError(404, "Video not found", { videoId, requestId });
   }

   const userVideo = await VideoService.getUserVideoById(
      videoId,
      video,
      req.user._id,
   );

   videoLogger.info(`[Request] ${requestId} Fetched video successfully`, {
      videoId,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, userVideo, "successfully got video"));
});

const updateVideo = asyncHandler(async (req, res) => {
   const requestId = req.id;
   const { videoId } = req.params;
   const { description, title, isPublished, visiblity } = req.body;
   videoLogger.info(`[Request] ${requestId} Updating video`, {
      videoId,
      userId: req.user._id,
   });

   const video = await VideoService.findVideoById(videoId);
   if (!video)
      throw new ApiError(404, "Video not found", { videoId, requestId });

   const isOwner = VideoService.isVideoOwner(video, req.user);
   if (!isOwner)
      throw new ApiError(403, "Not authorized to perform this operation", {
         videoId,
         requestId,
      });

   const updatedVideo = await VideoService.updateVideo(
      title,
      description,
      video,
      videoId,
      visiblity,
      isPublished,
      req?.file?.path,
   );

   videoLogger.info(`[Request] ${requestId} Video updated successfully`, {
      videoId,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, updatedVideo, "successfully updated video"));
});

const deleteVideo = asyncHandler(async (req, res) => {
   const requestId = req.id;
   const { videoId } = req.params;

   videoLogger.info(`[Request] ${requestId} Deleting video`, {
      videoId,
      userId: req.user._id,
   });

   const video = await VideoService.findVideoById(videoId);
   if (!video) {
      throw new ApiError(404, "Video not found", { videoId, requestId });
   }

   const isOwner = VideoService.isVideoOwner(video, req.user);
   if (!isOwner) {
      throw new ApiError(403, "Not authorized to perform this operation", {
         videoId,
         requestId,
      });
   }

   await VideoService.deleteVideo(video);

   videoLogger.info(`[Request] ${requestId} Video deleted successfully`, {
      videoId,
   });

   return res.status(204).end();
});

const downloadVideo = asyncHandler(async (req, res) => {
   const requestId = req.id;
   const { videoId } = req.params;

   videoLogger.info(`[Request] ${requestId} Downloading video`, {
      videoId,
      userId: req.user._id,
   });

   const video = await VideoService.findVideoById(videoId);
   if (!video) {
      throw new ApiError(404, "Video not found", { videoId, requestId });
   }

   videoLogger.info(`[Request] ${requestId} Redirecting to video file`, {
      videoId,
      videoFile: video.videoFile,
   });

   res.redirect(video.videoFile);
});

const togglePublishStatus = asyncHandler(async (req, res) => {
   const requestId = req.id;
   const { videoId } = req.params;

   videoLogger.info(`[Request] ${requestId} Toggling publish status`, {
      videoId,
      userId: req.user._id,
   });

   const video = await VideoService.findVideoById(videoId);
   if (!video) {
      throw new ApiError(404, "Video not found", { videoId, requestId });
   }

   const isOwner = VideoService.isVideoOwner(video, req.user);
   if (!isOwner) {
      throw new ApiError(403, "Not authorized to perform this operation", {
         videoId,
         requestId,
      });
   }

   const updateVideo = await VideoService.togglePublishStatus(video);

   videoLogger.info(
      `[Request] ${requestId} Publish status toggled successfully`,
      {
         videoId,
         isPublished: updateVideo.isPublished,
      },
   );

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
