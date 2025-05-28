import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as LikeService from "./like.service.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
	const isLiked = await Like.find({
		video: req.video._id,
		likedBy: req.user._id,
	});

	if (isLiked.length > 0) {
		await LikeService.unlikeVideo(req.video, req.user);
		return res.status(204).send();
	} else {
		const like = await LikeService.likeVideo(req.video, req.user);
		return res.status(201).json(new ApiResponse(201, like, "Liked video"));
	}
});

const toggleCommentLike = asyncHandler(async (req, res) => {
	const isLiked = await Like.find({
		comment: req.comment._id,
		likedBy: req.user._id,
	});
	if (isLiked.length > 0) {
		await LikeService.unlikeComment(req.comment, req.user);
		return res.status(204).end();
	} else {
		const like = await LikeService.likeComment(req.comment, req.user);
		return res.status(201).json(new ApiResponse(201, like, "Liked comment"));
	}
});

const toggleTweetLike = asyncHandler(async (req, res) => {
	const isLiked = await Like.find({
		tweet: req.tweet._id,
		likedBy: req.user._id,
	});
	if (isLiked.length > 0) {
		await LikeService.unlikeTweet(req.tweet, req.user);
		return res.status(204).end();
	} else {
		const like = await LikeService.likeTweet(req.tweet, req.user);
		return res.status(201).json(new ApiResponse(201, like, "Liked tweet"));
	}
});

const getLikedVideos = asyncHandler(async (req, res) => {
	const { userId } = req.params;
	const user = userId || req.user._id;
	const likedVideos = await LikeService.getLikedVideos(user);
	return res
		.status(200)
		.json(new ApiResponse(200, likedVideos, "Successfully got liked videos"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
