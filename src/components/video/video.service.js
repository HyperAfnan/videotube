import mongoose from "mongoose";
import { ApiError } from "../../utils/apiErrors.js";
import { serviceHandler } from "../../utils/handlers.js";
import { User } from "../user/user.models.js";
import { Video } from "./video.models.js";
import {
	deleteImageOnCloudinary,
	deleteVideoOnCloudinary,
	uploadImageOnCloudinary,
	uploadVideoOnCloudinary,
} from "../../utils/fileHandlers.js";

export const findUserById = serviceHandler(async (userId) => {
	const user = await User.findById(userId);
	return user;
});

export const findVideoById = serviceHandler(async (videoId) => {
	const video = await Video.findById(videoId);
	return video;
});

export const isVideoOwner = serviceHandler(
	async (video, user) => video.owner.toString() === user._id.toString(),
);

export const getAllVideos = serviceHandler(
	async (page, limit, q, sortBy, sortType, userId) => {
		if (sortType === "asc") sortType = 1;
		else if (sortType === "desc") sortType = -1;
		else sortType = -1;

		if (!sortBy) sortBy = "createdAt";

		const aggregate = Video.aggregate([
			{ $match: { owner: new mongoose.Types.ObjectId(String(userId)) } },
			{ $match: { title: { $regex: q } } },
			{ $sort: { [sortBy]: sortType } },
		]);

		const myCustomLabels = {
			totalDocs: "videoCount",
			docs: "videos",
			page: "currentPage",
		};
		const options = { page, limit, customLabels: myCustomLabels };

		const data = await Video.aggregatePaginate(aggregate, options).catch(
			(err) => {
				console.log(err);
				throw new ApiError(500, "Internal Server error");
			},
		);
		return data;
	},
);

export const publishVideo = serviceHandler(
	async (title, description, user, videoFileLocalPath, thumbnailLocalPath) => {
		const videoFile = await uploadVideoOnCloudinary(videoFileLocalPath).catch(
			(e) => {
				console.log(e);
				throw new ApiError(500, "failed to upload video file");
			},
		);
		const thumbnail = await uploadImageOnCloudinary(thumbnailLocalPath).catch(
			(e) => {
				console.log(e);
				throw new ApiError(500, "failed to upload video thumbnail");
			},
		);
		const duration = Math.floor(videoFile.duration);
		console.log("uploading video with data", {
			videoFile: videoFile.secure_url,
			thumbnail: thumbnail.secure_url,
			title,
			description,
			duration,
			owner: user._id,
			isPublished: true,
		});

		const video = await Video.create({
			videoFile: videoFile.secure_url,
			thumbnail: thumbnail.secure_url,
			title,
			description,
			duration,
			owner: user._id,
			isPublished: true,
		});
		if (!video) throw new ApiError(500, "Internal server error");

		return video;
	},
);

export const getUserVideoById = serviceHandler(
	async (videoId, videoMeta, userId) => {
		const video = await Video.findByIdAndUpdate(
			videoId,
			{ views: videoMeta.views + 1 },
			{ new: true },
		);

		await User.updateOne(
			{ _id: userId },
			{ $push: { watchHistory: new mongoose.Types.ObjectId(String(videoId)) } },
		);

		return video;
	},
);

export const updateVideo = serviceHandler(
	async (title, description, videoMeta, videoId, thumbnailLocalPath) => {
		let thumbnail;
		if (thumbnailLocalPath) {
			await deleteImageOnCloudinary(videoMeta.thumbnail).catch((e) => {
				console.log(`Failed to delete thumbnail \n${e}`);
				throw new ApiError(500, "Failed to delete thumbnail");
			});
			thumbnail = await uploadImageOnCloudinary(thumbnailLocalPath).catch(
				(e) => {
					console.log(`Failed to upload thumbnail \n${e}`);
					throw new ApiError(500, "Failed to upload thumbnail");
				},
			);
		}

		const video = await Video.findByIdAndUpdate(
			videoId,
			{ title, description, thumbnail: thumbnail?.secure_url },
			{ new: true },
		);

		return video;
	},
);

export const deleteVideo = serviceHandler(async (videoMeta) => {
	await deleteVideoOnCloudinary(videoMeta.videoFile).catch((e) => {
		console.log("Failed to delete video  file \n ", e);
		throw new ApiError(500, "Failed to delete video file");
	});
	await deleteImageOnCloudinary(videoMeta.thumbnail).catch((e) => {
		console.log("Failed to delete video thumbnail \n ", e);
		throw new ApiError(500, "Failed to delete video thumbnail");
	});
	await Video.findByIdAndDelete(videoMeta._id).catch((e) => {
		console.log("Failed to delete video data from db \n ", e);
		throw new ApiError(500, "Failed to delete video data from db");
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

	return video;
});
