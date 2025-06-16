import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as LikeService from "./like.service.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
	const { videoId } = req.params;

	const video = await LikeService.findVideoById(videoId);
	if (!video) throw new ApiError(404, "Video not found");

	const isLiked = await LikeService.isLikedVideo(video, req.user);
	if (isLiked.length > 0) {
		await LikeService.unlikeVideo(video, req.user);
		return res.status(204).send();
	} else {
		const like = await LikeService.likeVideo(video, req.user);
		return res.status(201).json(new ApiResponse(201, like, "Liked video"));
	}
});

const toggleCommentLike = asyncHandler(async (req, res) => {
	const { commentId } = req.params;

	const comment = await LikeService.findCommentById(commentId);
	if (!comment) throw new ApiError(404, "Comment not found");

	const isLiked = await LikeService.isLikedComment(comment, req.user);
	if (isLiked.length > 0) {
		await LikeService.unlikeComment(comment, req.user);
		return res.status(204).end();
	} else {
		const like = await LikeService.likeComment(comment, req.user);
		return res.status(201).json(new ApiResponse(201, like, "Liked comment"));
	}
});

const toggleTweetLike = asyncHandler(async (req, res) => {
	const { tweetId } = req.params;

	const tweet = await LikeService.findTweetById(tweetId);
	if (!tweet) throw new ApiError(404, "Tweet not found");

	const isLiked = await LikeService.isLikedTweet(tweet, req.user);
	if (isLiked.length > 0) {
		await LikeService.unlikeTweet(tweet, req.user);
		return res.status(204).end();
	} else {
		const like = await LikeService.likeTweet(tweet, req.user);
		return res.status(201).json(new ApiResponse(201, like, "Liked tweet"));
	}
});

const getLikedVideos = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	if (userId) {
		const user = await LikeService.findUserById(userId);
		if (!user) throw new ApiError(404, "User not found");
	}

	const user = userId || req.user._id;
	const likedVideos = await LikeService.getLikedVideos(user);
	return res
		.status(200)
		.json(new ApiResponse(200, likedVideos, "Successfully got liked videos"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
