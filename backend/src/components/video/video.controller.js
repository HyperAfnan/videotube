import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as VideoService from "./video.service.js";
import { logger } from "../../utils/logger/index.js";
const videoLogger = logger.child({ module: "video.controllers" });
import fetch from "node-fetch";
import crypto from "crypto";
import { s3Client } from "../../config/aws.js";
import {
   AbortMultipartUploadCommand,
   CompleteMultipartUploadCommand,
   CreateMultipartUploadCommand,
   UploadPartCommand,
} from "@aws-sdk/client-s3";


const getFeed = asyncHandler(async (req, res) => {
   const { page = 1, limit = 10, q = "", sortBy, sortType, } = req.query;

   videoLogger.info(`[Request] ${req.id} Fetching all videos`, {
      page,
      limit,
      q,
      sortBy,
      sortType,
   });

   const allVideos = await VideoService.getAllVideos(
      page,
      limit,
      q,
      sortBy,
      sortType,
   );

   videoLogger.info(`[Request] ${req.id} Fetched videos successfully`, {
      count: allVideos.length,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, allVideos, "successfully got all videos"));
})

const getAllVideos = asyncHandler(async (req, res) => {
   const { page = 1, limit = 10, q = "", sortBy, sortType } = req.query;

   videoLogger.info(`[Request] ${req.id} Fetching all videos`, {
      page,
      limit,
      q,
      sortBy,
      sortType,
   });

   const allVideos = await VideoService.getAllVideos(
      page,
      limit,
      q,
      sortBy,
      sortType,
   );

   videoLogger.info(`[Request] ${req.id} Fetched videos successfully`, {
      count: allVideos.length,
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
   console.log(videoFileLocalPath);
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

   videoLogger.info(`[Request] ${requestId} Streaming video for download`, {
      videoId,
      videoFile: video.videoFile,
   });

   const cloudinaryRes = await fetch(video.videoFile);
   if (!cloudinaryRes.ok) {
      throw new ApiError(500, "Failed to fetch video from Cloudinary");
   }

   res.setHeader("Content-Disposition", `attachment; filename="${videoId}.mp4"`);
   res.setHeader("Content-Type", "video/mp4");

   cloudinaryRes.body.pipe(res);
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

const bucketName = "bucket-1"
const key = `videos/${crypto.randomUUID()}.mp4`;

const startChunkedUpload = asyncHandler(async (req, res) => {
   const requestId = req.id;

   videoLogger.info(`[Request] ${requestId} Uploading chunked video`, {
      userId: req.user._id,
   });

   const createResponse = await s3Client.send(
      new CreateMultipartUploadCommand({
         Bucket: bucketName,
         Key: key,
         ContentType: "video/mp4",
      })
   );

   if (!createResponse.UploadId) {
      videoLogger.error(
         `[Request] ${requestId} Failed to create multipart upload. Missing UploadId.`, { userId: req.user._id, }
      );
      throw new ApiError(500, "Failed to create multipart upload. Missing UploadId.");
   }

   videoLogger.info(`[Request] ${requestId} Multipart upload created successfully`, {
      userId: req.user._id,
      uploadId: createResponse.UploadId,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, { uploadId: createResponse.UploadId, key }, "Multipart upload initiated successfully"));
})

const chunkedUpload = asyncHandler(async (req, res) => {
   const requestId = req.id;
   const { uploadId, partNumber } = req.query;
   const filePath = req.file.path;  

   const fileStats = await stat(filePath);
   const fileSize = fileStats.size;

   if (fileSize === 0) {
      videoLogger.error(`[Request] ${requestId} The file is empty and cannot be uploaded.`, { userId: req.user._id, });
      throw new ApiError(400, "The file is empty and cannot be uploaded.");
   }

   const buffer = await fs.promises.readFile(filePath);

   const uploadPartResponse = await s3Client.send(
      new UploadPartCommand({
         Bucket: bucketName,
         Key: key,
         UploadId: uploadId,
         PartNumber: partNumber,
         Body: buffer,
      })
   );

   if (!uploadPartResponse.ETag) {
      videoLogger.error(`[Request] ${requestId} Missing ETag for part ${partNumber}.`, { userId: req.user._id, });
      throw new ApiError(500, `Missing ETag for part ${partNumber}.`);
   }

   videoLogger.info(`[Request] ${requestId} Part ${partNumber} uploaded successfully`, {
      userId: req.user._id,
      partNumber,
      eTag: uploadPartResponse.ETag,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, { ETag: uploadPartResponse.ETag, PartNumber: partNumber }, `Part ${partNumber} uploaded successfully`)); 
})

const completeChunkedUpload = asyncHandler(async (req, res) => {
   const requestId = req.id;
   const { uploadId, parts } = req.body;

   videoLogger.info(`[Request] ${requestId} Completing chunked upload`, {
      userId: req.user._id,
      uploadId,
   });

   const completeResponse = await s3Client.send(
      new CompleteMultipartUploadCommand({
         Bucket: bucketName,
         Key: key,
         UploadId: uploadId,
         MultipartUpload: {
            Parts: parts,
         },
      })
   );

   videoLogger.info(`[Request] ${requestId} Chunked upload completed successfully`, {
      userId: req.user._id,
      uploadId,
      location: completeResponse.Location,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, { location: completeResponse.Location }, "Chunked upload completed successfully"));
})

export {
   getFeed,
   getAllVideos,
   publishAVideo,
   getVideoById,
   updateVideo,
   deleteVideo,
   downloadVideo,
   togglePublishStatus,

   startChunkedUpload,
   chunkedUpload,
   completeChunkedUpload,
};
