import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";

const getAllVideos = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
	//TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
	// TODO: get video, upload to cloudinary, create video
	const { title, description } = req.body;
	const videoFileLocalPath = req.files.videoFile[0].path;
	const thumbnailLocalPath = req.files.thumbnail[0].path;

	if (!title) {
		throw new ApiError(402, "Title is required");
	}
	if (!description) {
		throw new ApiError(402, "Description is required");
	}
	if (!videoFileLocalPath) {
		throw new ApiError(402, "VideoFile is required");
	}
	if (!thumbnail) {
		throw new ApiError(402, "Thumbnail is required");
	}

	const videoFile = await uploadOnCloudinary(videoFileLocalPath);
	const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

	const video = await Video.create({
		videoFile: videoFile.secure_url,
		thumbnail: thumbnail.secure_url,
		title,
		description,
		duration: Math.floor(videoFile.duration),
		owner: req.user,
		isPublished: true,
	});

	return res
		.status(201)
		.json(new ApiResponse(200, video, "User registered successfully "));
});

const getVideoById = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	//TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	//TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
	//TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
	const { videoId } = req.params;
});

export {
	getAllVideos,
	publishAVideo,
	getVideoById,
	updateVideo,
	deleteVideo,
	togglePublishStatus,
};
