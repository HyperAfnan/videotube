import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as LikeService from "./like.service.js";
import { logger } from "../../utils/logger/index.js";
const likeLogger = logger.child({ module: "like.controllers" });

const toggleVideoLike = asyncHandler(async (req, res) => {
   const { videoId } = req.params;
   const { type = "like" } = req.query;
   const requestId = req.id;

   likeLogger.info(`[Request] ${requestId} Toggling like for video`, {
      videoId,
      userId: req.user._id,
      type,
   });

   const video = await LikeService.findVideoById(videoId);
   if (!video) {
      throw new ApiError(404, "Video not found", { videoId, requestId });
   }

   const existingLikes = await LikeService.isLikedVideo(video, req.user);
   
   if (existingLikes.length > 0) {
      const existingLike = existingLikes[0];
      
      if (existingLike.type === type) {
         await LikeService.unlikeVideo(video, req.user);
         likeLogger.info(`[Request] ${requestId} Video ${type} removed`, {
            videoId,
            userId: req.user._id,
            type,
         });
         return res.status(200).json(new ApiResponse(200, null, `${type} removed`));
      } else {
         await LikeService.unlikeVideo(video, req.user);
         const newLike = await LikeService.likeVideo(video, req.user, type);
         likeLogger.info(`[Request] ${requestId} Video ${type} changed`, {
            videoId,
            userId: req.user._id,
            oldType: existingLike.type,
            newType: type,
            likeId: newLike._id,
         });
         return res.status(200).json(new ApiResponse(200, newLike, `Changed to ${type}`));
      }
   } else {
      const like = await LikeService.likeVideo(video, req.user, type);
      likeLogger.info(`[Request] ${requestId} Video ${type} added`, {
         videoId,
         userId: req.user._id,
         likeId: like._id,
         type,
      });
      return res.status(201).json(new ApiResponse(201, like, `Video ${type}d`));
   }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
   const { commentId } = req.params;
   const { type = "like" } = req.query;
   const requestId = req.id;

   likeLogger.info(`[Request] ${requestId} Toggling like for comment`, {
      commentId,
      userId: req.user._id,
      type,
   });

   const comment = await LikeService.findCommentById(commentId);
   if (!comment) {
      throw new ApiError(404, "Comment not found", { commentId, requestId });
   }

   const existingLikes = await LikeService.isLikedComment(comment, req.user);
   
   if (existingLikes.length > 0) {
      const existingLike = existingLikes[0];
      
      if (existingLike.type === type) {
         await LikeService.unlikeComment(comment, req.user);
         likeLogger.info(`[Request] ${requestId} Comment ${type} removed`, {
            commentId,
            userId: req.user._id,
            type,
         });
         return res.status(200).json(new ApiResponse(200, null, `${type} removed`));
      } else {
         await LikeService.unlikeComment(comment, req.user);
         const newLike = await LikeService.likeComment(comment, req.user, type);
         likeLogger.info(`[Request] ${requestId} Comment ${type} changed`, {
            commentId,
            userId: req.user._id,
            oldType: existingLike.type,
            newType: type,
            likeId: newLike._id,
         });
         return res.status(200).json(new ApiResponse(200, newLike, `Changed to ${type}`));
      }
   } else {
      const like = await LikeService.likeComment(comment, req.user, type);
      likeLogger.info(`[Request] ${requestId} Comment ${type} added`, {
         commentId,
         userId: req.user._id,
         likeId: like._id,
         type,
      });
      return res.status(201).json(new ApiResponse(201, like, `Comment ${type}d`));
   }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
   const { tweetId } = req.params;
   const { type = "like" } = req.query;
   const requestId = req.id;

   likeLogger.info(`[Request] ${requestId} Toggling like for tweet`, {
      tweetId,
      userId: req.user._id,
      type,
   });

   const tweet = await LikeService.findTweetById(tweetId);
   if (!tweet) {
      throw new ApiError(404, "Tweet not found", { tweetId, requestId });
   }

   const existingLikes = await LikeService.isLikedTweet(tweet, req.user);
   
   // If user already has a like/dislike
   if (existingLikes.length > 0) {
      const existingLike = existingLikes[0];
      
      // If clicking same type, remove it (unlike/undislike)
      if (existingLike.type === type) {
         await LikeService.unlikeTweet(tweet, req.user);
         likeLogger.info(`[Request] ${requestId} Tweet ${type} removed`, {
            tweetId,
            userId: req.user._id,
            type,
         });
         return res.status(200).json(new ApiResponse(200, null, `${type} removed`));
      } else {
         await LikeService.unlikeTweet(tweet, req.user);
         const newLike = await LikeService.likeTweet(tweet, req.user, type);
         likeLogger.info(`[Request] ${requestId} Tweet ${type} changed`, {
            tweetId,
            userId: req.user._id,
            oldType: existingLike.type,
            newType: type,
            likeId: newLike._id,
         });
         return res.status(200).json(new ApiResponse(200, newLike, `Changed to ${type}`));
      }
   } else {
      const like = await LikeService.likeTweet(tweet, req.user, type);
      likeLogger.info(`[Request] ${requestId} Tweet ${type} added`, {
         tweetId,
         userId: req.user._id,
         likeId: like._id,
         type,
      });
      return res.status(201).json(new ApiResponse(201, like, `Tweet ${type}d`));
   }
});

const getLikedVideos = asyncHandler(async (req, res) => {
   const { userId } = req.params;
   const requestId = req.id;

   likeLogger.info(`[Request] ${requestId} Fetching liked videos`, {
      requestedUserId: userId,
      currentUserId: req.user._id,
   });

   if (userId) {
      const user = await LikeService.findUserById(userId);
      if (!user) {
         throw new ApiError(404, "User not found", { userId, requestId });
      }
   }

   const user = userId || req.user._id;
   const likedVideos = await LikeService.getLikedVideos(user);

   likeLogger.info(`[Request] ${requestId} Fetched liked videos`, {
      user,
      count: likedVideos.length,
   });

   return res
      .status(200)
      .json(new ApiResponse(200, likedVideos, "Successfully got liked videos"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
