import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as userService from "./user.services.js";
import { logger } from "../../utils/logger/index.js";
const userLogger = logger.child({ module: "user.controllers" });

const cookieOptions = { httpOnly: true, secure: true };

const registerUser = asyncHandler(async (req, res) => {
	const { fullName, email, username, password } = req.body;
	userLogger.info("Registration attempt", { route: "POST /users", email });

	const avatarLocalPath = req.files?.avatar?.[0]?.path;
	const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

	const isEmailExists = await userService.findUserByEmail(email);
	if (isEmailExists) {
		userLogger.warn("Registration failed: email already exists", { email });
		throw new ApiError(400, "A user already exists with this e-mail address");
	}

	const isUsernameExists = await userService.findUserByUsername(username);
	if (isUsernameExists) {
		userLogger.warn("Registration failed: username already exists", { username });
		throw new ApiError(400, "A user already exists with this username");
	}

	const user = await userService.registerUser(
		fullName,
		email,
		username,
		password,
		avatarLocalPath,
		coverImageLocalPath,
	);
	userLogger.info("Registration successful", { email, userId: user._id });

	return res
		.status(201)
		.json(new ApiResponse(201, user, "User registered successfully"));
});

const confirmEmail = asyncHandler(async (req, res) => {
	const { confirmationToken } = req.params;
	userLogger.info("Email confirmation attempt", { route: "GET /users/confirmEmail", confirmationToken });

	const isTokenValid = await userService.isConfirmationTokenValid(confirmationToken);
	if (!isTokenValid.status) {
		userLogger.warn("Invalid confirmation token", { confirmationToken });
		throw new ApiError(400, isTokenValid.message);
	}
	userLogger.info("Token is valid", { userId: isTokenValid.userMeta._id });

	const confirmEmail = await userService.confirmEmail(isTokenValid.userMeta);
	userLogger.info("Email confirmed", { userId: confirmEmail.user._id });

	return res
		.status(200)
		.cookie("accessToken", confirmEmail.accessToken, cookieOptions)
		.cookie("refreshToken", confirmEmail.refreshToken, cookieOptions)
		.json(new ApiResponse(200, null, "Email confirmed successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
	const { email } = req.body;
	userLogger.info("Login attempt", { route: "POST /users/login", email });

	const loginService = await userService.loginUser(email, req.body.password);
	userLogger.info("Login successful", { email, userId: loginService.user._id });

	return res
		.status(200)
		.cookie("accessToken", loginService.accessToken, cookieOptions)
		.cookie("refreshToken", loginService.refreshToken, cookieOptions)
		.json(new ApiResponse(200, loginService, "User logged In successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
	userLogger.info("Logout attempt", { route: "POST /users/logout", userId: req.user._id });

	await userService.logoutUser(req.user._id);
	userLogger.info("Logout successful", { userId: req.user._id });

	return res
		.status(204)
		.clearCookie("accessToken", cookieOptions)
		.clearCookie("refreshToken", cookieOptions)
		.end();
});

const deleteUser = asyncHandler(async (req, res) => {
	userLogger.info("User deletion attempt", { route: "DELETE /users", userId: req.user._id });

	await userService.deleteUser(req.user._id);
	userLogger.info("User deleted successfully", { userId: req.user._id });

	return res
		.status(204)
		.clearCookie("accessToken", cookieOptions)
		.clearCookie("refreshToken", cookieOptions)
		.end();
});

const refreshAccessToken = asyncHandler(async (req, res) => {
	const { refreshToken: bodyrefreshToken } = req.body;
	const { refreshToken: cookierefreshToken } = req.cookies;
	const token = bodyrefreshToken || cookierefreshToken;

	userLogger.info("Refresh access token attempt", { route: "POST /users/refreshAccessToken" });

	const isTokenValid = await userService.isRefreshTokenValid(token);
	if (!isTokenValid.status) {
		userLogger.warn("Invalid refresh token", { token });
		throw new ApiError(400, isTokenValid.message);
	}
	userLogger.info("Refresh token is valid", { userId: isTokenValid.userMeta._id });

	const { refreshToken, accessToken } = await userService.refreshAccessToken(isTokenValid.userMeta);
	userLogger.info("Access token refreshed", { userId: isTokenValid.userMeta._id });

	return res
		.status(200)
		.cookie("accessToken", accessToken, cookieOptions)
		.cookie("refreshToken", refreshToken, cookieOptions)
		.json(
			new ApiResponse(
				200,
				{ accessToken, refreshToken },
				"Access Token refreshed",
			),
		);
});

const forgotPassword = asyncHandler(async (req, res) => {
	const { email } = req.body;
	userLogger.info("Forgot password request", { route: "POST /users/forgotPassword", email });

	await userService.forgotPassword(email);
	userLogger.info("Password reset email sent", { email });

	return res.status(204).end();
});

const changePassword = asyncHandler(async (req, res) => {
	userLogger.info("Change password request", { route: "POST /users/changePassword", userId: req.user._id });

	await userService.changePassword(req.user._id, req.body.oldPassword, req.body.newPassword);
	userLogger.info("Password changed successfully", { userId: req.user._id });

	return res.status(204).end();
});

const resetPassword = asyncHandler(async (req, res) => {
	const { token } = req.params;
	userLogger.info("Reset password request", { route: "POST /users/resetPassword", token });

	await userService.resetPassword(token, req.body.newPassword);
	userLogger.info("Password reset successfully", { token });

	return res.status(204).end();
});

const updateAccountDetails = asyncHandler(async (req, res) => {
	const { fullName, username } = req.body;
	userLogger.info("Update account details attempt", { route: "PATCH /users/updateAccountDetails", userId: req.user._id, fullName, username });

	const isUserExistsWithUsername = await userService.findUserByUsername(username);
	if (isUserExistsWithUsername) {
		userLogger.warn("Username already exists", { username });
		throw new ApiError(400, "User already exists with this username");
	}

	const user = await userService.updateAccountDetails(
		req.user._id,
		fullName,
		username,
	);
	userLogger.info("Account details updated", { userId: req.user._id });

	return res
		.status(200)
		.json(new ApiResponse(200, user, "Account details updated "));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
	const avatarLocalPath = req.file.path;
	userLogger.info("Update avatar attempt", { route: "PATCH /users/updateAvatar", userId: req.user._id, avatarLocalPath });

	const user = await userService.updateUserAvatar(req.user._id, avatarLocalPath);
	userLogger.info("Avatar updated successfully", { userId: req.user._id });

	return res
		.status(200)
		.json(new ApiResponse(200, user, "successfully updated avatar"));
});

const updateUserCoverImg = asyncHandler(async (req, res) => {
	const coverLocalPath = req.file.path;
	userLogger.info("Update cover image attempt", { route: "PATCH /users/updateCoverImg", userId: req.user._id, coverLocalPath });

	const user = await userService.updateCoverAvatar(req.user._id, coverLocalPath);
	userLogger.info("Cover image updated successfully", { userId: req.user._id });

	return res
		.status(200)
		.json(new ApiResponse(200, user, "successfully updated cover image"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
	userLogger.info("Fetching current user", { route: "GET /users/", userId: req.user._id });

	return res
		.status(200)
		.json(new ApiResponse(200, req.user, "Current User Fetched successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
	const { username } = req.params;
	userLogger.info("Fetching channel profile", { route: "GET /users/channelProfile", username });

	const isUsernameExists = await userService.findUserByUsername(username);
	const userMeta = isUsernameExists || req.user;

	const channel = await userService.getUserChannelProfile(userMeta);
	userLogger.info("Channel profile fetched", { userId: userMeta._id });

	return res
		.status(200)
		.json(new ApiResponse(200, channel, "Channel fetched successfully"));
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
	userLogger.info("Fetching watch history", { route: "GET /users/watchHistory", userId: req.user._id });

	const user = await userService.getUserwatchHistory(req.user._id);
	userLogger.info("Watch history fetched", { userId: req.user._id });

	return res
		.status(200)
		.json(new ApiResponse(200, user, "watch history fetched successfully"));
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
