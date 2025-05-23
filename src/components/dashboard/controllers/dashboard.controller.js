import mongoose from "mongoose";
// import { ApiError} from "../../../utils/apiErrors.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import { User } from "../../user/models/user.models.js";

const getChannelStats = asyncHandler(async (req, res) => {
	const stats = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "channel",
				as: "subscriptions",
				pipeline: [
					{
						$lookup: {
							from: "users",
							localField: "subscriber",
							foreignField: "_id",
							as: "subscriber",
							pipeline: [{ $project: { username: 1, avatar: 1, _id: 0 } }],
						},
					},
					{ $unwind: "$subscriber" },
					{ $project: { subscriber: 1, _id: 0 } },
				],
			},
		},
		{
			$lookup: {
				from: "videos",
				localField: "_id",
				foreignField: "owner",
				as: "videos",
				pipeline: [
					{
						$lookup: {
							from: "likes",
							localField: "_id",
							foreignField: "video",
							as: "likes",
							pipeline: [
								{
									$lookup: {
										from: "users",
										localField: "likedBy",
										foreignField: "_id",
										as: "likedBy",
										pipeline: [{ $project: { username: 1, _id: 0 } }],
									},
								},
								{ $unwind: "$likedBy" },
								{ $project: { likedBy: 1, _id: 0 } },
							],
						},
					},
					{ $unwind: "$likes" },
				],
			},
		},
		{
			$addFields: {
				totalVideos: { $size: "$videos" },
				totalLikes: { $size: "$videos.likes" },
				totalSubscribers: { $size: "$subscriptions" },
			},
		},
		{
			$project: {
				fullName: 1,
				username: 1,
				avatar: 1,
				videos: 1,
				subscriptions: 1,
				totalVideos: 1,
				totalLikes: 1,
			},
		},
	]);

	return res
		.status(200)
		.json(new ApiResponse(200, stats, "Successfully got channel stats"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
	const channelVideos = await User.aggregaate([
		{ $match: { _id: new mongoose.Types.ObjectId(req.user._id) } },
		{
			$lookup: {
				from: "videos",
				localField: "_id",
				foreignField: "owner",
				as: "videos",
			},
		},
		{ $addFields: { totalVideos: { $size: "$videos" } } },
		{ $project: { videos: 1, username: 1, totalVideos: 1, _id: 0 } },
	]);

	return res
		.status(200)
		.json(
			new ApiResponse(200, channelVideos, "Successfully got channel videos")
		);
});

export { getChannelStats, getChannelVideos };
