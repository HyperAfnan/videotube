import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as LikeService from "./like.service.js";
import { logger } from "../../utils/logger/index.js";
const likeLogger = logger.child({ module: "like.controllers" });

const toggleVideoLike = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	const requestId = req.id;

	likeLogger.info(`[Request] ${requestId} Toggling like for video`, {
		videoId,
		userId: req.user._id,
	});

	const video = await LikeService.findVideoById(videoId);
	if (!video) {
		throw new ApiError(404, "Video not found", { videoId, requestId });
	}

	const isLiked = await LikeService.isLikedVideo(video, req.user);
	if (isLiked.length > 0) {
		await LikeService.unlikeVideo(video, req.user);
		likeLogger.info(`[Request] ${requestId} Video unliked`, {
			videoId,
			userId: req.user._id,
		});
		return res.status(204).send();
	} else {
		const like = await LikeService.likeVideo(video, req.user);
		likeLogger.info(`[Request] ${requestId} Video liked`, {
			videoId,
			userId: req.user._id,
			likeId: like._id,
		});
		return res.status(201).json(new ApiResponse(201, like, "Liked video"));
	}
});

const toggleCommentLike = asyncHandler(async (req, res) => {
	const { commentId } = req.params;
	const requestId = req.id;

	likeLogger.info(`[Request] ${requestId} Toggling like for comment`, {
		commentId,
		userId: req.user._id,
	});

	const comment = await LikeService.findCommentById(commentId);
	if (!comment) {
		throw new ApiError(404, "Comment not found", { commentId, requestId });
	}

	const isLiked = await LikeService.isLikedComment(comment, req.user);
	if (isLiked.length > 0) {
		await LikeService.unlikeComment(comment, req.user);
		likeLogger.info(`[Request] ${requestId} Comment unliked`, {
			commentId,
			userId: req.user._id,
		});
		return res.status(204).end();
	} else {
		const like = await LikeService.likeComment(comment, req.user);
		likeLogger.info(`[Request] ${requestId} Comment liked`, {
			commentId,
			userId: req.user._id,
			likeId: like._id,
		});
		return res.status(201).json(new ApiResponse(201, like, "Liked comment"));
	}
});

const toggleTweetLike = asyncHandler(async (req, res) => {
	const { tweetId } = req.params;
	const requestId = req.id;

	likeLogger.info(`[Request] ${requestId} Toggling like for tweet`, {
		tweetId,
		userId: req.user._id,
	});

	const tweet = await LikeService.findTweetById(tweetId);
	if (!tweet) {
		throw new ApiError(404, "Tweet not found", { tweetId, requestId });
	}

	const isLiked = await LikeService.isLikedTweet(tweet, req.user);
	if (isLiked.length > 0) {
		await LikeService.unlikeTweet(tweet, req.user);
		likeLogger.info(`[Request] ${requestId} Tweet unliked`, {
			tweetId,
			userId: req.user._id,
		});
		return res.status(204).end();
	} else {
		const like = await LikeService.likeTweet(tweet, req.user);
		likeLogger.info(`[Request] ${requestId} Tweet liked`, {
			tweetId,
			userId: req.user._id,
			likeId: like._id,
		});
		return res.status(201).json(new ApiResponse(201, like, "Liked tweet"));
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

export {
	toggleCommentLike,
	toggleTweetLike,
	toggleVideoLike,
	getLikedVideos,
};
