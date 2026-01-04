import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as userService from "./user.service.js";
import { logger } from "../../utils/logger/index.js";
const userLogger = logger.child({ module: "user.controllers" });

const updateAccountDetails = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { fullname, username } = req.body;

	userLogger.info(`[Request] ${requestId} Update account details attempt`, {
		route: "PATCH /users/updateAccountDetails",
		userId: req.user._id,
		fullname,
		username,
	});

	const isUserExistsWithUsername =
		await userService.findUserByUsername(username);
	if (isUserExistsWithUsername) {
		throw new ApiError(400, "User already exists with this username", {
			username,
			requestId,
		});
	}

	const user = await userService.updateAccountDetails(
		req.user._id,
		fullname,
		username,
	);
	userLogger.info(`[Request] ${requestId} Account details updated`, {
		userId: req.user._id,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, user, "Account details updated"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const avatarLocalPath = req.file.path;

	userLogger.info(`[Request] ${requestId} Update avatar attempt`, {
		route: "PATCH /users/updateAvatar",
		userId: req.user._id,
		avatarLocalPath,
	});

	const user = await userService.updateUserAvatar(
		req.user._id,
		avatarLocalPath,
	);
	userLogger.info(`[Request] ${requestId} Avatar updated successfully`, {
		userId: req.user._id,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, user, "successfully updated avatar"));
});

const updateUserCoverImg = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const coverLocalPath = req.file.path;

	userLogger.info(`[Request] ${requestId} Update cover image attempt`, {
		route: "PATCH /users/updateCoverImg",
		userId: req.user._id,
		coverLocalPath,
	});

	const user = await userService.updateCoverAvatar(
		req.user._id,
		coverLocalPath,
	);
	userLogger.info(`[Request] ${requestId} Cover image updated successfully`, {
		userId: req.user._id,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, user, "successfully updated cover image"));
});

// NOTE: it still has some remain from the last change, make sure 
// remove the part which makes it getCurrentUser

// const getUser = asyncHandler(async (req, res) => {
// 	const requestId = req.id;
// 	const body = req.params;
// 	if (body?.userId) {
// 		userLogger.info(`[Request] ${requestId} Fetching user by ID`, {
// 			route: "GET /users/",
// 			userId: body.userId,
// 		});
//
// 		const user = await userService.findUserById(body.userId);
// 		if (!user) {
// 			throw new ApiError(404, "User not found", { userId: body.userId });
// 		}
// 		return res
// 			.status(200)
// 			.json(new ApiResponse(200, user, "User fetched successfully"));
// 	} else {
// 		userLogger.info(`[Request] ${requestId} Fetching current user`, {
// 			route: "GET /users/",
// 			userId: req?.user?._id,
// 		});
//
// 		return res
// 			.status(200)
// 			.json(
// 				new ApiResponse(200, req.user, "Current User Fetched successfully"),
// 			);
// 	}
// });

const getUserChannelProfile = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { username } = req.params;

	userLogger.info(`[Request] ${requestId} Fetching channel profile`, {
		route: "GET /users/channelProfile",
		username,
	});

	const isUsernameExists = await userService.findUserByUsername(username);
	const userMeta = isUsernameExists || req.user;

	const channel = await userService.getUserChannelProfile(userMeta);
	userLogger.info(`[Request] ${requestId} Channel profile fetched`, {
		userId: userMeta._id,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, channel, "Channel fetched successfully"));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
	const requestId = req.id;

	userLogger.info(`[Request] ${requestId} Fetching watch history`, {
		route: "GET /users/watchHistory",
		userId: req.user._id,
	});

	const user = await userService.getUserwatchHistory(req.user._id);
	userLogger.info(`[Request] ${requestId} Watch history fetched`, {
		userId: req.user._id,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, user, "watch history fetched successfully"));
});

export {
	updateAccountDetails,
	updateUserAvatar,
	updateUserCoverImg,
	getUserChannelProfile,
	getUserWatchHistory,
};
