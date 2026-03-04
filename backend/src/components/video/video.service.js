import { WatchHistory } from "../watchHistory/watchHistory.model.js";
import { Subscription } from "../subscription/subscription.model.js";
import { Like } from "../like/like.model.js";
import { ApiError } from "../../utils/apiErrors.js";
import { serviceHandler } from "../../utils/handlers.js";
import { User } from "../user/user.model.js";
import { Video } from "./video.model.js";
import {
   deleteImageOnCloudinary,
   deleteVideoOnCloudinary,
   uploadImageOnCloudinary,
   uploadVideoOnCloudinary,
} from "../../utils/fileHandlers.js";
import { logger } from "../../utils/logger/index.js";
const videoServiceLogger = logger.child({ module: "video.services" });
import { CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { stat } from "fs/promises";
import fs from "fs";
import crypto from "crypto";
import { s3Client } from "../../config/aws.js";

export const findUserById = serviceHandler(async (userId) => {
   const user = await User.findById(userId);
   return user;
});

export const findVideoById = serviceHandler(async (videoId) => {
   const video = await Video.findById(videoId);
   return video;
});

export const isVideoOwner = serviceHandler(async (video, user) => {
   const isOwner = video.owner.toString() === user._id.toString();
   return isOwner;
});

export const getFeed = serviceHandler(
   async (page, limit, q, sortBy, sortType) => {
      if (sortType === "asc") sortType = 1;
      else if (sortType === "desc") sortType = -1;
      else sortType = -1;

      if (!sortBy) sortBy = "createdAt";

      videoServiceLogger.info("Getting all videos", {
         page,
         limit,
         q,
         sortBy,
         sortType,
      });

      const aggregate = Video.aggregate([
         { $match: { title: { $regex: q } } },
         { $sort: { [sortBy]: sortType } },
         {
            $lookup: {
               from: "users",
               localField: "owner",
               foreignField: "_id",
               as: "owner",
               pipeline: [{ $project: { _id: 1, username: 1, avatar: 1 } }],
            },
         },
         { $unwind: "$owner" },
      ]);

      const myCustomLabels = {
         totalDocs: "videoCount",
         docs: "videos",
         page: "currentPage",
      };
      const options = { page, limit, customLabels: myCustomLabels };

      const data = await Video.aggregatePaginate(aggregate, options).catch(
         (err) => {
            throw new ApiError(500, "Failed to get all videos", {
               err: err.message,
               stack: err.stack,
            });
         },
      );
      videoServiceLogger.info("Fetched videos with pagination", {
         page,
         limit,
         count: data?.videos?.length ?? 0,
      });
      return data;
   },
);

export const getAllVideos = serviceHandler(
   async (page, limit, q, sortBy, sortType, userId) => {
      if (sortType === "asc") sortType = 1;
      else if (sortType === "desc") sortType = -1;
      else sortType = -1;

      if (!sortBy) sortBy = "createdAt";

      videoServiceLogger.info("Getting all videos", {
         page,
         limit,
         q,
         sortBy,
         sortType,
         // userId,
      });

      const aggregate = Video.aggregate([
         // { $match: { owner: new mongoose.Types.ObjectId(String(userId)) } },
         { $match: { title: { $regex: q } } },
         { $sort: { [sortBy]: sortType } },
         {
            $lookup: {
               from: "users",
               localField: "owner",
               foreignField: "_id",
               as: "owner",
               pipeline: [{ $project: { _id: 1, username: 1, avatar: 1 } }],
            },
         },
         { $unwind: "$owner" },
      ]);

      const myCustomLabels = {
         totalDocs: "videoCount",
         docs: "videos",
         page: "currentPage",
      };
      const options = { page, limit, customLabels: myCustomLabels };

      const data = await Video.aggregatePaginate(aggregate, options).catch(
         (err) => {
            throw new ApiError(500, "Failed to get all videos", {
               err: err.message,
               stack: err.stack,
            });
         },
      );
      videoServiceLogger.info("Fetched videos with pagination", {
         page,
         limit,
         count: data?.videos?.length ?? 0,
         // userId,
      });
      return data;
   },
);

// TODO: add checks according to the new vidoe model
export const publishVideo = serviceHandler(
   async (
      title,
      description,
      user,
      videoFileLocalPath,
      visibility,
      isPublished,
   ) => {
      let videoFile;
      try {
         videoFile = await uploadVideoOnCloudinary(videoFileLocalPath);
      } catch (e) {
         throw new ApiError(500, "Failed to upload video file to Cloudinary", {
            error: e.message,
            userId: user._id,
         });
      }
      const thumbnail =
         "https://res.cloudinary.com/cloud6969/image/upload/v1754142017/ibhkkendkpqhr5g6pmaa_t7alae.webp";
      const duration = Math.floor(videoFile?.duration);
      videoServiceLogger.info("Uploading video with data", {
         videoFile: videoFile?.url,
         thumbnail,
         title,
         description,
         duration,
         owner: user._id,
         isPublished,
         visibility,
      });


      const video = await Video.create({
         videoFile: videoFile?.url,
         thumbnail,
         title,
         description,
         duration,
         owner: user._id,
         isPublished,
         visibility,
      });
      if (!video) {
         throw new ApiError(500, "Video creation failed in DB");
      }
      videoServiceLogger.info("Video published successfully", {
         videoId: video._id,
         userId: user._id,
      });
      return video;
   },
);

export const getUserVideoById = serviceHandler(
   async (videoId, videoMeta, userId) => {
      const video = await Video.findByIdAndUpdate(
         videoId,
         { $inc: { views: 1 } },
         { new: true },
      ).populate({
         path: "owner",
         select: "_id username avatar",
      });

      const subscribers = await Subscription.countDocuments({
         subscribedTo: video.owner._id,
      });

      const LikeCount = await Like.countDocuments({
         video: videoId,
         type: "like",
      });
      let videoObj = video.toObject();

      let isSubscribed = false;

      if (userId) {
         isSubscribed = await Subscription.exists({
            subscribedBy: userId,
            subscribedTo: video.owner._id,
         });

         const isLiked = await Like.exists({
            likedBy: userId,
            video: videoId,
            type: "like",
         });
         const isDisliked = await Like.exists({
            likedBy: userId,
            video: videoId,
            type: "dislike",
         });

         videoObj = {
            ...videoObj,
            owner: {
               ...videoObj.owner,
               subscribers,
            },
            likes: LikeCount,
            userInteration: {
               isLiked: Boolean(isLiked),
               isDisliked: Boolean(isDisliked),
               isSubscribed: Boolean(isSubscribed),
            },
         };
      }

      await WatchHistory.create({
         user: userId,
         video: videoId,
         isWatched: false,
         watchDates: [{ date: new Date(), duration: 0 }],
      }).catch(async (_) => {
         await WatchHistory.findOneAndUpdate(
            { user: userId, video: videoId },
            { $push: { watchDates: { date: new Date(), duration: 0 } } },
         );
      });

      videoServiceLogger.info("Fetched and updated user video by ID", {
         videoId,
         userId,
      });
      return videoObj;
   },
);

export const updateVideo = serviceHandler(
   async (
      title,
      description,
      videoMeta,
      videoId,
      visibility,
      isPublished,
      thumbnailLocalPath,
   ) => {
      // logger.debug("thumbnailLocalPath", thumbnailLocalPath);

      console.log(
         title,
         description,
         videoMeta,
         videoId,
         visibility,
         isPublished,
         thumbnailLocalPath,
      );
      let thumbnail;
      if (thumbnailLocalPath) {
         try {
            await deleteImageOnCloudinary(videoMeta.thumbnail);
         } catch (e) {
            throw new ApiError(500, "Failed to delete thumbnail", {
               videoId,
               error: e.message,
               stack: e.stack,
            });
         }
         try {
            thumbnail = await uploadImageOnCloudinary(thumbnailLocalPath);
         } catch (e) {
            throw new ApiError(500, "Failed to upload thumbnail", {
               videoId,
               error: e.message,
               stack: e.stack,
            });
         }
      }

      const video = await Video.findByIdAndUpdate(
         videoId,
         {
            title,
            description,
            thumbnail: thumbnail?.secure_url,
            visibility,
            isPublished,
         },
         { new: true },
      );

      videoServiceLogger.info("Video updated successfully", { videoId });
      return video;
   },
);

export const deleteVideo = serviceHandler(async (videoMeta) => {
   try {
      await deleteVideoOnCloudinary(videoMeta.videoFile);
   } catch (e) {
      throw new ApiError(500, "Failed to delete video file from Cloudinary", {
         videoId: videoMeta._id,
         error: e.message,
         stack: e.stack,
      });
   }
   try {
      await deleteImageOnCloudinary(videoMeta.thumbnail);
   } catch (e) {
      throw new ApiError(
         500,
         "Failed to delete video thumbnail from Cloudinary",
         { videoId: videoMeta._id, error: e.message },
      );
   }
   try {
      await Video.findByIdAndDelete(videoMeta._id);
   } catch (e) {
      throw new ApiError(500, "Failed to delete video data from DB", {
         videoId: videoMeta._id,
         error: e.message,
      });
   }
   videoServiceLogger.info("Video deleted successfully", {
      videoId: videoMeta._id,
   });
});

export const togglePublishStatus = serviceHandler(async (videoMeta) => {
   let video;
   if (!videoMeta.isPublished)
      video = await Video.findByIdAndUpdate(
         videoMeta._id,
         { isPublished: true },
         { new: true },
      );
   else
      video = await Video.findByIdAndUpdate(
         videoMeta._id,
         { isPublished: false },
         { new: true },
      );
   videoServiceLogger.info("Toggled publish status", {
      videoId: videoMeta._id,
      isPublished: video.isPublished,
   });
   return video;
});


const bucketName = "bucket-1";

export const startChunkedUploadService = serviceHandler(async ({ userId, requestId }) => {
   videoServiceLogger.info(`[Request] ${requestId} Starting chunked upload`, { userId });
   const key = `videos/${crypto.randomUUID()}.mp4`;

   let createResponse;
   try {
      createResponse = await s3Client.send(
         new CreateMultipartUploadCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: "video/mp4",
         }),
      );
   } catch (err) {
      console.error("CreateMultipartUpload failed:", err);
      throw err;
   }

   if (!createResponse.UploadId) {
      videoServiceLogger.error(
         `[Request] ${requestId} Failed to create multipart upload. Missing UploadId.`, { userId },
      );
      throw new ApiError(500, "Failed to create multipart upload. Missing UploadId.");
   }

   videoServiceLogger.info(`[Request] ${requestId} Multipart upload created successfully`, {
      userId,
      uploadId: createResponse.UploadId,
   });

   return { uploadId: createResponse.UploadId, key };
});

export const chunkedUploadService = serviceHandler(async ({ userId, requestId, uploadId, partNumber, key, filePath }) => {

   videoServiceLogger.info(`[Request] ${requestId} Uploading part ${partNumber}`, {
      userId,
      uploadId,
      key,
      filePath,
   });
   const fileStats = await stat(filePath);
   const fileSize = fileStats.size;

   if (fileSize === 0) {
      videoServiceLogger.error(`[Request] ${requestId} The file is empty and cannot be uploaded.`, { userId });
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
      }),
   );

   if (!uploadPartResponse.ETag) {
      videoServiceLogger.error(`[Request] ${requestId} Missing ETag for part ${partNumber}.`, { userId });
      throw new ApiError(500, `Missing ETag for part ${partNumber}.`);
   }

   videoServiceLogger.info(`[Request] ${requestId} Part ${partNumber} uploaded successfully`, {
      userId,
      partNumber,
      eTag: uploadPartResponse.ETag,
   });

   return { ETag: uploadPartResponse.ETag, PartNumber: partNumber };
});

export const completeChunkedUploadService = serviceHandler(async ({
   user,
   requestId,
   uploadId,
   parts,
   key,
   // title,
   // description,
   // visibility,
   // isPublished,
   // duration,
}) => {
   videoServiceLogger.info(`[Request] ${requestId} Completing chunked upload`, {
      userId: user._id,
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
      }),
   );

   if (!completeResponse.Location) {
      videoServiceLogger.error(`[Request] ${requestId} Failed to complete multipart upload. Missing Location in response.`, {
         userId: user._id,
         uploadId,
      });
      throw new ApiError(500, "Failed to complete multipart upload. Missing Location in response.");
   }

   // const video = await Video.create({
   //    videoFile: completeResponse.Location,
   //    title,
   //    description,
   //    owner: user._id,
   //    isPublished,
   //    visibility,
   //    duration,
   // });
   //
   // if (!video) {
   //    videoServiceLogger.error(`[Request] ${requestId} Failed to create video record in DB after completing upload`, {
   //       userId: user._id,
   //       uploadId,
   //       location: completeResponse.Location,
   //    });
   //    throw new ApiError(500, "Failed to create video record in DB after completing upload");
   // }

   videoServiceLogger.info(`[Request] ${requestId} Chunked upload completed successfully`, {
      userId: user._id,
      uploadId,
      location: completeResponse.Location,
   });

   return { location: completeResponse.Location };
});
