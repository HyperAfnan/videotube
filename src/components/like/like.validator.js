import { param } from "express-validator";

export const toggleVideoLikeValidator = [
	param("videoId")
		.notEmpty()
		.withMessage("Video id is required")
		.isMongoId()
		.withMessage("Invalid video id"),
];

export const toggleCommentLikeValidator = [
	param("commentId")
		.notEmpty()
		.withMessage("Comment id is required")
		.isMongoId()
		.withMessage("Invalid comment id"),
];
export const toggleTweetLikeValidator = [
	param("tweetId")
		.notEmpty()
		.withMessage("Tweet id is required")
		.isMongoId()
		.withMessage("Invalid tweet id"),
];

export const getLikedVideosValidator = [
	param("userId").optional().isMongoId().withMessage("Invalid user id"),
];
