import { ApiError } from "../../utils/apiErrors.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as authService from "./auth.service.js";
import { logger } from "../../utils/logger/index.js";
const authLogger = logger.child({ module: "auth.controllers" });

const cookieOptions = { httpOnly: true, secure: true, sameSite: "Strict" };

const registerUser = asyncHandler(async (req, res) => {
	const { fullname, email, username, password } = req.body;
	const requestId = req.id;

	authLogger.info(`[Request] ${requestId} registration attempt`, {
		route: "POST /users",
		email,
	});

	const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
	const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

	const isEmailExists = await authService.findUserByEmail(email);
	if (isEmailExists) {
		throw new ApiError(400, "A user already exists with this e-mail address", {
			email,
			requestId,
		});
	}

	const isUsernameExists = await authService.findUserByUsername(username);
	if (isUsernameExists) {
		throw new ApiError(400, "A user already exists with this username", {
			username,
			requestId,
		});
	}

	const user = await authService.registerUser(
		fullname,
		email,
		username,
		password,
		avatarLocalPath,
		coverImageLocalPath,
	);
	authLogger.info(`[Request] ${requestId} Registration successful`, {
		email,
		userId: user._id,
	});

	return res
		.status(201)
		.json(new ApiResponse(201, user, "User registered successfully"));
});

const sendConfirmationEmail = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { email } = req.body;

	authLogger.info(`[Request] ${requestId} Sending confirmation email`, {
		route: "POST /users/sendConfirmationEmail",
		email,
	});

	const isEmailExists = await authService.findUserByEmail(email);
	if (!isEmailExists) {
		throw new ApiError(400, "No user found with this e-mail address", {
			email,
			requestId,
		});
	}

	await authService.callEmailService(isEmailExists);
	authLogger.info(`[Request] ${requestId} Confirmation email sent`, {
		email,
	});

	return res
		.status(200)
		.json(new ApiResponse(200, null, "Confirmation email sent successfully"));
});

const confirmEmail = asyncHandler(async (req, res) => {
	const { confirmationToken } = req.params;
	const requestId = req.id;

	authLogger.info(`[Request] ${requestId} Email confirmation attempt`, {
		route: "GET /users/confirmEmail",
		confirmationToken,
	});

	const isTokenValid =
		await authService.isConfirmationTokenValid(confirmationToken);
	if (!isTokenValid.status) {
		throw new ApiError(400, isTokenValid.message, {
			confirmationToken,
			requestId,
		});
	}
	authLogger.info(`[Request] ${requestId} Token is valid`, {
		userId: isTokenValid.userMeta._id,
	});

	const { refreshToken, accessToken } = await authService.confirmEmail(
		isTokenValid.userMeta,
	);
	authLogger.info(`[Request] ${requestId} Email confirmed`, {
		userId: isTokenValid.userMeta._id,
	});

	return res
		.status(200)
		.cookie("refreshToken", refreshToken, cookieOptions)
		.json(
			new ApiResponse(200, { accessToken }, "Email confirmed successfully"),
		);
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	const requestId = req.id;

	authLogger.info(`[Request] ${requestId} Login attempt`, {
		route: "POST /users/login",
		email,
	});

	const loginService = await authService.loginUser(email, password);
	authLogger.info(`[Request] ${requestId} Login successful`, {
		email,
		userId: loginService.data.user._id,
	});

	return res
		.status(200)
		.cookie("refreshToken", loginService.refreshToken, cookieOptions)
		.cookie("accessToken", loginService.data.accessToken, cookieOptions)
		.json(
			new ApiResponse(200, loginService.data, "User logged In successfully"),
		);
});

const logoutUser = asyncHandler(async (req, res) => {
	const requestId = req.id;

	authLogger.info(`[Request] ${requestId} Logout attempt`, {
		route: "POST /users/logout",
		userId: req.user._id,
	});

	await authService.logoutUser(req.user._id);
	authLogger.info(`[Request] ${requestId} Logout successful`, {
		userId: req.user._id,
	});

	return res
		.status(204)
		.clearCookie("accessToken", cookieOptions)
		.clearCookie("refreshToken", cookieOptions)
		.end();
});

const deleteUser = asyncHandler(async (req, res) => {
	const requestId = req.id;

	authLogger.info(`[Request] ${requestId} User deletion attempt`, {
		route: "DELETE /users",
		userId: req.user._id,
	});

	await authService.deleteUser(req.user._id);
	authLogger.info(`[Request] ${requestId} User deleted successfully`, {
		userId: req.user._id,
	});

	return res
		.status(204)
		.clearCookie("accessToken", cookieOptions)
		.clearCookie("refreshToken", cookieOptions)
		.end();
});

const refreshAccessToken = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { refreshToken: cookierefreshToken } = req.cookies || {};
	const { refreshToken: bodyrefreshToken } = req.body || {};
	authLogger.debug("[Request] Body Refresh token:", bodyrefreshToken);
	authLogger.debug("[Request] Cookie Refresh token:", cookierefreshToken);

	const token = bodyrefreshToken || cookierefreshToken;

	authLogger.info(`[Request] ${requestId} Refresh access token attempt`, {
		route: "POST /users/refreshAccessToken",
	});

	const isTokenValid = await authService.isRefreshTokenValid(token);
	if (!isTokenValid.status) {
		throw new ApiError(400, isTokenValid.message, { token, requestId });
	}
	authLogger.info(`[Request] ${requestId} Refresh token is valid`, {
		userId: isTokenValid.userMeta._id,
	});

	const { refreshToken, accessToken } = await authService.refreshAccessToken(
		isTokenValid.userMeta,
	);
	authLogger.info(`[Request] ${requestId} Access token refreshed`, {
		userId: isTokenValid.userMeta._id,
	});

	return res
		.status(200)
		.cookie("refreshToken", refreshToken, cookieOptions)
		.json(new ApiResponse(200, { accessToken }, "Access Token refreshed"));
});

const forgotPassword = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { email } = req.body;

	authLogger.info(`[Request] ${requestId} Forgot password request`, {
		route: "POST /users/forgotPassword",
		email,
	});

	await authService.forgotPassword(email);
	authLogger.info(`[Request] ${requestId} Password reset email sent`, {
		email,
	});

	return res.status(204).end();
});

const changePassword = asyncHandler(async (req, res) => {
	const requestId = req.id;

	authLogger.info(`[Request] ${requestId} Change password request`, {
		route: "POST /users/changePassword",
		userId: req.user._id,
	});

	await authService.changePassword(
		req.user._id,
		req.body.oldPassword,
		req.body.newPassword,
	);
	authLogger.info(`[Request] ${requestId} Password changed successfully`, {
		userId: req.user._id,
	});

	return res.status(204).end();
});

const resetPassword = asyncHandler(async (req, res) => {
	const requestId = req.id;
	const { token } = req.params;

	authLogger.info(`[Request] ${requestId} Reset password request`, {
		route: "POST /users/resetPassword",
		token,
	});

	await authService.resetPassword(token, req.body.newPassword);
	authLogger.info(`[Request] ${requestId} Password reset successfully`, {
		token,
	});

	return res.status(204).end();
});

// TODO: change it to get current user only, getUser will be in the user component

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
	// getUser,
	sendConfirmationEmail,
};
