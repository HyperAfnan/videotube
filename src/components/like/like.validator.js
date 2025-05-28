import { param } from "express-validator";
import { Video } from "../video/video.models.js";
import { Comment } from "../comment/comments.models.js";
import { Tweet } from "../tweet/tweet.models.js";
import { User } from "../user/user.models.js";
import { ApiError } from "../../utils/apiErrors.js";

export const videoIdValidator = async (req, _, next) => {
	const video = await Video.findById(req.params.videoId);
	if (!video) throw new ApiError(404, "Video not found");
	if (video.owner._id.toString() !== req.user._id.toString()) {
		if (video.isPublished === false)
			throw new ApiError(403, "Video is not published yet");
	}
	req.video = video;
	next();
};
export const commentIdValidator = async (req, _, next) => {
	const comment = await Comment.findById(req.params.commentId);
	if (!comment) throw new ApiError(404, "Comment not found");
	req.comment = comment;
	next();
};
export const tweetIdValidator = async (req, _, next) => {
	const tweet = await Tweet.findById(req.params.tweetId);
	if (!tweet) throw new ApiError(404, "Tweet not found");
	req.tweet = tweet;
	next();
};

export const userIdValidator = async (req, _, next) => {
	if (req?.params?.userId) {
		const user = await User.findById(req?.params?.userId);
		if (!user) throw new ApiError(404, "User not found");
		req.newUser = user;
	} else req.newUser = req.user;
	next();
};

export const toggleVideoLikeValidator = [
	param("videoId")
		.isEmpty()
		.withMessage("Video id is required")
		.isMongoId()
		.withMessage("Invalid video id"),
];

export const toggleCommentLikeValidator = [
	param("commentId")
		.isEmpty()
		.withMessage("Comment id is required")
		.isMongoId()
		.withMessage("Invalid comment id"),
];
export const toggleTweetLikeValidator = [
	param("tweetId")
		.isEmpty()
		.withMessage("Tweet id is required")
		.isMongoId()
		.withMessage("Invalid tweet id"),
];

export const getLikedVideosValidator = [
	param("userId").optional().isMongoId().withMessage("Invalid user id"),
];
