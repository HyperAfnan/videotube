import { User } from "../user/user.models.js";
import { serviceHandler } from "../../utils/handlers.js";
import mongoose from "mongoose";

export const getChannelStats = serviceHandler(async (userMeta) => {
	const stats = await User.aggregate([
		{ $match: { _id: new mongoose.Types.ObjectId(userMeta._id) } },
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

	return stats;
});

export const getChannelVideos = serviceHandler(async (userMeta) => {
	const channelVideos = await User.aggregaate([
		{ $match: { _id: new mongoose.Types.ObjectId(userMeta._id) } },
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

	return channelVideos;
});
