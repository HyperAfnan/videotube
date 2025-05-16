import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { deleteOnCloudinary } from "../utils/fileDelete.js";

const getAllVideos = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
	//TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
	// TODO: get video, upload to cloudinary, create video
	const { title, description } = req.body;
	const videoFileLocalPath = req.files.videoFile[0].path;
	const thumbnailLocalPath = req.files.thumbnail[0].path;

	const data = { title, description, videoFileLocalPath, thumbnailLocalPath };
	for (let i = 0; i < data.length; i++) {
		if (!data[i]) {
			throw new ApiError(402, `${data[i]} is required`);
		}
	}

	const videoFile = await uploadOnCloudinary(videoFileLocalPath).catch((e) =>
		console.log("Failed to upload video file \n", e)
	);
	const thumbnail = await uploadOnCloudinary(thumbnailLocalPath).catch((e) =>
		console.log("Failed to upload video thumbnail\n", e)
	);
	const duration = Math.floor(videoFile.duration);

	const video = await Video.create({
		videoFile: videoFile.secure_url,
		thumbnail: thumbnail.secure_url,
		title,
		description,
		duration,
		owner: req.user,
		isPublished: true,
	});

	return res
		.status(201)
		.json(new ApiResponse(200, video, "User registered successfully "));
});

const getVideoById = asyncHandler(async (req, res) => {
	//TODO: get video by id
	const { videoId } = req.params;

	const isValidVideo = isValidObjectId(videoId);
	if (!isValidVideo) {
		throw new ApiError(400, "Invalid Video Id");
	}

	const videoData = await Video.findById(videoId);
	if (!videoData) {
		throw new ApiError(404, "Video not found");
	}

	const video = await Video.findByIdAndUpdate(videoData._id, {
		views: videoData.views + 1,
	});

	return res
		.status(201)
		.json(new ApiResponse(200, video, "successfully got video"));
});

const updateVideo = asyncHandler(async (req, res) => {
	//TODO: update video details like title, description, thumbnail

	// get video id and validate that, if not valid throw error
	// get thumbnail local path , title , description
	// check if what is defined, if nothing is defined, throw error
	// update what is defined
	// return the new value

	const { videoId } = req.params;
	const { description, title } = req.body;

	const isValidVideo = isValidObjectId(videoId);
	if (!isValidVideo) {
		throw new ApiError(400, "Invalid Video Id");
	}

	const videoData = await Video.findById(videoId);
	if (videoData.owner.toString() !== req.user._id.toString()) {
		throw new ApiError(404, "Video not found");
	}

	var thumbnail;
	const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
	if (thumbnailLocalPath) {
		await deleteOnCloudinary(videoData.thumbnail).catch((e) =>
			console.log("Failed to delete thumbnail \n" + e)
		);
		thumbnail = await uploadOnCloudinary(thumbnailLocalPath).catch((e) =>
			console.log("Failed to upload thumbnail \n" + e)
		);
	}

	const video = await Video.findByIdAndUpdate(
		videoId,
		{ title, description, thumbnail: thumbnail.secure_url },
		{ new: true }
	);

	return res
		.status(201)
		.json(new ApiResponse(200, video, "Video updated successfully "));
});

const deleteVideo = asyncHandler(async (req, res) => {
	//TODO: delete video
	const { videoId } = req.params;

	const isValidVideo = isValidObjectId(videoId);
	if (!isValidVideo) {
		throw new ApiError(400, "Invalid Video Id");
	}
	const video = await Video.findById(videoId);
	if (video.owner.toString() !== req.user._id.toString()) {
		throw new ApiError(404, "Video not found");
	}
	if (!video) {
		throw new ApiError("Video not found");
	}

	await deleteOnCloudinary(video.videoFile).catch((e) =>
		console.log("Failed to delete video file \n ", e)
	);
	await deleteOnCloudinary(video.thumbnail).catch((e) =>
		console.log("Failed to delete video thumbnail \n ", e)
	);
	await Video.findByIdAndDelete(videoId).catch((e) =>
		console.log("Failed to delete video data from db \n ", e)
	);

	return res
		.status(201)
		.json(new ApiResponse(200, {}, "Video deleted successfully "));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
	const { videoId } = req.params;

	const isValidVideo = isValidObjectId(videoId);
	if (!isValidVideo) {
		throw new ApiError(400, "Invalid Video Id");
	}

	const videoData = await Video.findById(videoId);
	if (!videoData) {
		throw new ApiError(404, "Video not found");
	}

	if (videoData.owner.toString() !== req.user._id.toString()) {
		throw new ApiError(404, "Video not found");
	}

	var video;
	if (!videoData.isPublished) {
		video = await Video.findByIdAndUpdate(videoData._id, { isPublished: true });
	} else {
		video = await Video.findByIdAndUpdate(videoData._id, {
			isPublished: false,
		});
	}

	res
		.status(200)
		.json(new ApiResponse(200, video, "successfully toggled publish status"));
});

export {
	getAllVideos,
	publishAVideo,
	getVideoById,
	updateVideo,
	deleteVideo,
	togglePublishStatus,
};
