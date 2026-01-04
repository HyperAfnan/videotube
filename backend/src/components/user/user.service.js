import { User } from "./user.model.js";
import { WatchHistory } from "../watchHistory/watchHistory.model.js";
import { serviceHandler } from "../../utils/handlers.js";
import {
	deleteImageOnCloudinary,
	uploadImageOnCloudinary,
} from "../../utils/fileHandlers.js";
import { ObjectId } from "mongodb";
import { logger } from "../../utils/logger/index.js";
const userServiceLogger = logger.child({ module: "user.services" });

export const findUserById = serviceHandler(async (_id) => {
	const user = await User.findById(_id).select("-password -refreshToken");
	return user;
});

export const findUserByEmail = serviceHandler(async (email) => {
	const user = await User.findOne({ email });
	return user;
});

export const findUserByUsername = serviceHandler(async (username) => {
	const user = await User.findOne({ username });
	return user;
});

export const updateAccountDetails = serviceHandler(
	async (userId, fullname, username) => {
		const user = await User.findByIdAndUpdate(
			userId,
			{ $set: { fullname, username } },
			{ new: true },
		).select("-password -refreshToken");

		userServiceLogger.info("Account details updated", {
			userId,
			username,
			fullname,
		});
		return user;
	},
);

export const updateUserAvatar = serviceHandler(
	async (userid, avatarLocalPath) => {
		const user = await User.findById(userid);

		await deleteImageOnCloudinary(user.avatar);
		const avatar = await uploadImageOnCloudinary(avatarLocalPath);
		const updatedUser = await User.findByIdAndUpdate(
			user._id,
			{
				$set: { avatar: avatar.secure_url },
			},
			{ new: true },
		).select("-password -refreshToken");

		userServiceLogger.info("Avatar updated", {
			userId: user._id,
			username: user.username,
			oldAvatar: user.avatar,
			newAvatar: updatedUser.avatar,
		});
		return updatedUser;
	},
);

export const updateCoverAvatar = serviceHandler(
	async (userid, coverLocalPath) => {
		const user = await User.findById(userid);

		await deleteImageOnCloudinary(user.coverImage);
		const coverImage = await uploadImageOnCloudinary(coverLocalPath);
		const updatedUser = await User.findByIdAndUpdate(
			user._id,
			{ $set: { coverImage: coverImage.secure_url } },
			{ new: true },
		).select("-password -refreshToken");

		userServiceLogger.info("Cover image updated", {
			userId: user._id,
			username: user.username,
			oldCover: user.coverImage,
			newCover: updatedUser.coverImage,
		});
		return updatedUser;
	},
);

export const getUserChannelProfile = serviceHandler(async (userMeta) => {
	const user = await User.aggregate([
		{
			$match: { username: userMeta.username },
		},
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "channel",
				as: "subscribers",
			},
		},
		{
			$lookup: {
				from: "subscriptions",
				localField: "_id",
				foreignField: "subscriber",
				as: "subscribedTo",
			},
		},
		{
			$addFields: {
				subscribersCount: { $size: "$subscribers" },
				subscribedToCount: { $size: "$subscribedTo" },
				isSubscribed: {
					$cond: {
						if: { $in: [userMeta._id, "$subscribers.subscriber"] },
						then: true,
						else: false,
					},
				},
			},
		},
		{
			$project: {
				fullname: 1,
				username: 1,
				subscribersCount: 1,
				subscribedToCount: 1,
				avatar: 1,
				coverImage: 1,
				isSubscribed: 1,
				email: 1,
				subscribers: 1,
				subscribedTo: 1,
			},
		},
	]);

	userServiceLogger.info("Fetched user channel profile", {
		userId: userMeta._id,
		username: userMeta.username,
	});
	return user[0];
});

export const getUserwatchHistory = serviceHandler(async (userId) => {
	const watchHistory = await WatchHistory.aggregate([
		{ $match: { user: new ObjectId(String(userId)) } },
		{
			$lookup: {
				from: "videos",
				localField: "video",
				foreignField: "_id",
				as: "videoDetails",
				pipeline: [
					{
						$lookup: {
							from: "users",
							localField: "owner",
							foreignField: "_id",
							as: "ownerDetails",
							pipeline: [
								{
									$project: {
										fullname: 1,
										username: 1,
										avatar: 1,
									},
								},
							],
						},
					},
					{
						$project: {
							title: 1,
							thumbnail: 1,
							duration: 1,
							ownerDetails: { $arrayElemAt: ["$ownerDetails", 0] },
						},
					},
				],
			},
		},
		{
			$project: {
				_id: 0,
				video: { $arrayElemAt: ["$videoDetails", 0] },
				isWatched: 1,
				watchDates: 1,
				user: 1,
			},
		},
	]);
	userServiceLogger.info("Fetched user watch history", { userId });
	return watchHistory;
});
