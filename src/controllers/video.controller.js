import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import {
	deleteImageOnCloudinary,
	deleteVideoOnCloudinary,
} from "../utils/fileDelete.js";

const getAllVideos = asyncHandler(async (req, res) => {
	// if userId is passed it returns videos for the user
	// if it is not passed it returns all videos of current user

	var { page = 1, limit = 10, q, sortBy, sortType, userId } = req.query;

	if (sortType === "asc") sortType = 1;
	else if (sortType === "desc") sortType = -1;
	else sortType = -1;

	if (!sortBy) sortBy = "createdAt";
	if (!q) throw new ApiError(400, "q query is required");
	if (userId)
		if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid userId");

	const user = userId || req.user._id;

	const aggregate = Video.aggregate([
		{ $match: { owner: new mongoose.Types.ObjectId(user) } },
		{ $match: { title: { $regex: q } } },
		{ $sort: { [sortBy]: sortType } },
	]);

	const myCustomLabels = {
		totalDocs: "videoCount",
		docs: "videos",
		page: "currentPage",
	};
	const options = { page, limit, customLabels: myCustomLabels };

	await Video.aggregatePaginate(aggregate, options)
		.then(function (data) {
			return res
				.status(200)
				.json(new ApiResponse(200, data, "successfully got all videos"));
		})
		.catch(function (err) {
			console.log(err);
		});
});

const publishAVideo = asyncHandler(async (req, res) => {
	const { title, description } = req.body;
	const videoFileLocalPath = req.files.videoFile[0].path;
	const thumbnailLocalPath = req.files.thumbnail[0].path;

	const data = { title, description, videoFileLocalPath, thumbnailLocalPath };
	for (let i = 0; i < data.length; i++) {
		if (!data[i]) throw new ApiError(400, `${data[i]} is required`);
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
		owner: req.user._id,
		isPublished: true,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, video, "User registered successfully "));
});

// TODO: add condition if the video is published then only it will show other wse 404
const getVideoById = asyncHandler(async (req, res) => {
	const { videoId } = req.params;

	if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");

	const videoData = await Video.findById(videoId);
	if (!videoData) throw new ApiError(404, "Video not found");

	const video = await Video.findByIdAndUpdate(
		videoData._id,
		{
			views: videoData.views + 1,
		},
		{ new: true }
	);

	await User.updateOne(
		{ _id: req.user._id },
		{ $push: { watchHistory: new mongoose.Types.ObjectId(videoData._id) } }
	);

	return res
		.status(200)
		.json(new ApiResponse(200, video, "successfully got video"));
});

const updateVideo = asyncHandler(async (req, res) => {
	// get video id and validate that, if not valid throw error
	// get thumbnail local path , title , description
	// check if what is defined, if nothing is defined, throw error
	// update what is defined
	// return the new value

	const { videoId } = req.params;
	const { description, title } = req.body;

	if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");

	const videoData = await Video.findById(videoId);
	if (!videoData) throw new ApiError(404, "Video not found");
	if (videoData.owner.toString() !== req.user._id.toString())
		throw new ApiError(402, "Unauthorized to update video");

	var thumbnail;
	if (req.file && req.file?.path) {
		const thumbnailLocalPath = req.file.path;
		await deleteImageOnCloudinary(videoData.thumbnail).catch((e) =>
			console.log("Failed to delete thumbnail \n" + e)
		);
		thumbnail = await uploadOnCloudinary(thumbnailLocalPath).catch((e) =>
			console.log("Failed to upload thumbnail \n" + e)
		);
	}

	const updatedVideo = await Video.findByIdAndUpdate(
		videoId,
		{ title, description, thumbnail: thumbnail?.secure_url },
		{ new: true }
	);

	return res
		.status(200)
		.json(new ApiResponse(200, updatedVideo, "successfully updated video"));
});

const deleteVideo = asyncHandler(async (req, res) => {
	const { videoId } = req.params;

	if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");
	const video = await Video.findById(videoId);
	if (video.owner.toString() !== req.user._id.toString())
		throw new ApiError(403, "Unauthorized to delete video");
	if (!video) throw new ApiError(404, "Video not found");

	await deleteVideoOnCloudinary(video.videoFile).catch((e) =>
		console.log("Failed to delete video file \n ", e)
	);
	await deleteImageOnCloudinary(video.thumbnail).catch((e) =>
		console.log("Failed to delete video thumbnail \n ", e)
	);
	await Video.findByIdAndDelete(videoId).catch((e) =>
		console.log("Failed to delete video data from db \n ", e)
	);

	return res.status(204).end();
});

const togglePublishStatus = asyncHandler(async (req, res) => {
	const { videoId } = req.params;

	if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid Video Id");

	const videoData = await Video.findById(videoId);
	if (!videoData) throw new ApiError(404, "Video not found");

	if (videoData.owner.toString() !== req.user._id.toString())
		throw new ApiError(403, "Unauthorized to update video");

	var video;
	if (!videoData.isPublished)
		video = await Video.findByIdAndUpdate(
			videoData._id,
			{ isPublished: true },
			{ new: true }
		);
	else
		video = await Video.findByIdAndUpdate(
			videoData._id,
			{ isPublished: false },
			{ new: true }
		);

	return res
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
