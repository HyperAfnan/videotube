import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as userService from "./user.service.js";
import { logger } from "../../utils/logger/index.js";
const userLogger = logger.child({ module: "user.controllers" });

const cookieOptions = { httpOnly: true, secure: true };

const registerUser = asyncHandler(async (req, res) => {
	const { fullName, email, username, password } = req.body;
	const requestId = req.id;

	userLogger.info(`[Request] ${requestId} registration attempt`, {
		route: "POST /users",
		email,
	});

	const avatarLocalPath = req.files?.avatar?.[0]?.path;
	const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

	const isEmailExists = await userService.findUserByEmail(email);
	if (isEmailExists) {
		throw new ApiError(400, "A user already exists with this e-mail address", {
			email,
			requestId,
		});
	}

	const isUsernameExists = await userService.findUserByUsername(username);
	if (isUsernameExists) {
		throw new ApiError(400, "A user already exists with this username", {
			username,
			requestId,
		});
	}

	const user = await userService.registerUser(
		fullName,
		email,
		username,
		password,
		avatarLocalPath,
		coverImageLocalPath,
	);
	userLogger.info(`[Request] ${requestId} Registration successful`, { email, userId: user._id });

	return res
		.status(201)
		.json(new ApiResponse(201, user, "User registered successfully"));
});

const confirmEmail = asyncHandler(async (req, res) => {
	const { confirmationToken } = req.params;
	const requestId = req.id;

	userLogger.info(`[Request] ${requestId} Email confirmation attempt`, {
		route: "GET /users/confirmEmail",
		confirmationToken,
	});

	const isTokenValid = await userService.isConfirmationTokenValid(confirmationToken);
	if (!isTokenValid.status) {
		throw new ApiError(400, isTokenValid.message, { confirmationToken, requestId });
	}
	userLogger.info(`[Request] ${requestId} Token is valid`, { userId: isTokenValid.userMeta._id });

	const confirmEmail = await userService.confirmEmail(isTokenValid.userMeta);
	userLogger.info(`[Request] ${requestId} Email confirmed`, { userId: isTokenValid.userMeta._id });

	return res
		.status(200)
		.cookie("accessToken", confirmEmail.accessToken, cookieOptions)
		.cookie("refreshToken", confirmEmail.refreshToken, cookieOptions)
		.json(new ApiResponse(200, null, "Email confirmed successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
	const { email } = req.body;
	const requestId = req.id;

	userLogger.info(`[Request] ${requestId} Login attempt`, { route: "POST /users/login", email });

	const loginService = await userService.loginUser(email, req.body.password);
	userLogger.info(`[Request] ${requestId} Login successful`, { email, userId: loginService.user._id });

	return res
		.status(200)
		.cookie("accessToken", loginService.accessToken, cookieOptions)
		.cookie("refreshToken", loginService.refreshToken, cookieOptions)
		.json(new ApiResponse(200, loginService, "User logged In successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
	const requestId = req.id;

	userLogger.info(`[Request] ${requestId} Logout attempt`, {
		route: "POST /users/logout",
		userId: req.user._id,
	});

	await userService.logoutUser(req.user._id);
	userLogger.info(`[Request] ${requestId} Logout successful`, { userId: req.user._id });

	return res
		.status(204)
		.clearCookie("accessToken", cookieOptions)
		.clearCookie("refreshToken", cookieOptions)
		.end();
});

const deleteUser = asyncHandler(async (req, res) => {
	const requestId = req.id;

	userLogger.info(`[Request] ${requestId} User deletion attempt`, {
		route: "DELETE /users",
		userId: req.user._id,
	});

	await userService.deleteUser(req.user._id);
	userLogger.info(`[Request] ${requestId} User deleted successfully`, { userId: req.user._id });

	return res
		.status(204)
		.clearCookie("accessToken", cookieOptions)
		.clearCookie("refreshToken", cookieOptions)
		.end();
});

const refreshAccessToken = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { refreshToken: bodyrefreshToken } = req.body;
	const { refreshToken: cookierefreshToken } = req.cookies;
	const token = bodyrefreshToken || cookierefreshToken;

	userLogger.info(`[Request] ${requestId} Refresh access token attempt`, {
		route: "POST /users/refreshAccessToken",
	});

	const isTokenValid = await userService.isRefreshTokenValid(token);
	if (!isTokenValid.status) {
		throw new ApiError(400, isTokenValid.message, { token, requestId });
	}
	userLogger.info(`[Request] ${requestId} Refresh token is valid`, {
		userId: isTokenValid.userMeta._id,
	});

	const { refreshToken, accessToken } = await userService.refreshAccessToken(isTokenValid.userMeta);
	userLogger.info(`[Request] ${requestId} Access token refreshed`, {
		userId: isTokenValid.userMeta._id,
	});

	return res
		.status(200)
		.cookie("accessToken", accessToken, cookieOptions)
		.cookie("refreshToken", refreshToken, cookieOptions)
		.json(new ApiResponse(200, { accessToken, refreshToken }, "Access Token refreshed"));
});

const forgotPassword = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { email } = req.body;

	userLogger.info(`[Request] ${requestId} Forgot password request`, {
		route: "POST /users/forgotPassword",
		email,
	});

	await userService.forgotPassword(email);
	userLogger.info(`[Request] ${requestId} Password reset email sent`, { email });

	return res.status(204).end();
});

const changePassword = asyncHandler(async (req, res) => {
	const requestId = req.id;

	userLogger.info(`[Request] ${requestId} Change password request`, {
		route: "POST /users/changePassword",
		userId: req.user._id,
	});

	await userService.changePassword(req.user._id, req.body.oldPassword, req.body.newPassword);
	userLogger.info(`[Request] ${requestId} Password changed successfully`, { userId: req.user._id });

	return res.status(204).end();
});

const resetPassword = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { token } = req.params;

	userLogger.info(`[Request] ${requestId} Reset password request`, {
		route: "POST /users/resetPassword",
		token,
	});

	await userService.resetPassword(token, req.body.newPassword);
	userLogger.info(`[Request] ${requestId} Password reset successfully`, { token });

	return res.status(204).end();
});

const updateAccountDetails = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { fullName, username } = req.body;

	userLogger.info(`[Request] ${requestId} Update account details attempt`, {
		route: "PATCH /users/updateAccountDetails",
		userId: req.user._id,
		fullName,
		username,
	});

	const isUserExistsWithUsername = await userService.findUserByUsername(username);
	if (isUserExistsWithUsername) {
		throw new ApiError(400, "User already exists with this username", {
			username,
			requestId,
		});
	}

	const user = await userService.updateAccountDetails(req.user._id, fullName, username);
	userLogger.info(`[Request] ${requestId} Account details updated`, { userId: req.user._id });

	return res.status(200).json(new ApiResponse(200, user, "Account details updated"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const avatarLocalPath = req.file.path;

	userLogger.info(`[Request] ${requestId} Update avatar attempt`, {
		route: "PATCH /users/updateAvatar",
		userId: req.user._id,
		avatarLocalPath,
	});

	const user = await userService.updateUserAvatar(req.user._id, avatarLocalPath);
	userLogger.info(`[Request] ${requestId} Avatar updated successfully`, { userId: req.user._id });

	return res.status(200).json(new ApiResponse(200, user, "successfully updated avatar"));
});

const updateUserCoverImg = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const coverLocalPath = req.file.path;

	userLogger.info(`[Request] ${requestId} Update cover image attempt`, {
		route: "PATCH /users/updateCoverImg",
		userId: req.user._id,
		coverLocalPath,
	});

	const user = await userService.updateCoverAvatar(req.user._id, coverLocalPath);
	userLogger.info(`[Request] ${requestId} Cover image updated successfully`, { userId: req.user._id });

	return res.status(200).json(new ApiResponse(200, user, "successfully updated cover image"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
	const requestId = req.id;

	userLogger.info(`[Request] ${requestId} Fetching current user`, {
		route: "GET /users/",
		userId: req.user._id,
	});

	return res.status(200).json(new ApiResponse(200, req.user, "Current User Fetched successfully"));
});

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
	userLogger.info(`[Request] ${requestId} Channel profile fetched`, { userId: userMeta._id });

	return res.status(200).json(new ApiResponse(200, channel, "Channel fetched successfully"));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
	const requestId = req.id;

	userLogger.info(`[Request] ${requestId} Fetching watch history`, {
		route: "GET /users/watchHistory",
		userId: req.user._id,
	});

	const user = await userService.getUserwatchHistory(req.user._id);
	userLogger.info(`[Request] ${requestId} Watch history fetched`, { userId: req.user._id });

	return res.status(200).json(new ApiResponse(200, user, "watch history fetched successfully"));
});

export {
	registerUser,
	loginUser,
	logoutUser,
	deleteUser,
	forgotPassword,
	refreshAccessToken,
	changePassword,
	resetPassword,
	confirmEmail,
	getCurrentUser,
	updateAccountDetails,
	updateUserAvatar,
	updateUserCoverImg,
	getUserChannelProfile,
	getUserWatchHistory,
};
