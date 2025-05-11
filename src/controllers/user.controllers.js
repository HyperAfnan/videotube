import { ApiError } from "../utils/apiErrors.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/fileUpload.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";

const generateTokens = async (userId) => {
	try {
		const user = await User.findById(userId);
		const accessToken = await user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		console.log(error);
		throw new ApiError(500, "something went wrong while generate tokens");
	}
};

const registerUser = asyncHandler(async (req, res) => {
	// get deta from frontend
	// validation of data
	// check if user already exist: username, email
	// chekc for images and check for avatar
	// upload them to cloudinary,  avatar
	// create user object - create entry in db
	// remove password and refresh token field from response
	// check for user creation
	// return res

	const { fullName, email, username, password } = req.body;

	if (fullName === "") {
		throw new ApiError(400, "full name is required");
	}
	if (email === "") {
		throw new ApiError(400, "email is required");
	}
	if (username === "") {
		throw new ApiError(400, "user name is required");
	}
	if (password === "") {
		throw new ApiError(400, "password is required");
	}

	const existedUser = await User.findOne({ $or: [{ username }, { email }] });
	if (existedUser) {
		throw new ApiError(409, "User with email or username already exists");
	}

	const avatarLocalPath = req.files?.avatar[0]?.path;
	let coverImageLocalPath;

	if (req.files?.coverImage) {
		coverImageLocalPath = req.files?.coverImage[0]?.path;
	}

	if (!avatarLocalPath) {
		throw new ApiError(400, "Avatar file is required");
	}

	const avatar = await uploadOnCloudinary(avatarLocalPath);
	var coverImage;
	if (coverImageLocalPath) {
		coverImage = await uploadOnCloudinary(coverImageLocalPath);
	}

	if (!avatar) {
		throw new ApiError(400, "Avatar is required");
	}

	const user = await User.create({
		fullName,
		email,
		avatar: avatar.secure_url,
		coverImage: coverImage?.secure_url || "",
		username: username.toLowerCase(),
		password,
	});

	const createUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);
	if (!createUser) {
		throw new ApiError(500, "Something went wrong while creating user");
	}

	return res
		.status(201)
		.json(new ApiResponse(200, createUser, "User registered successfully "));
});

const loginUser = asyncHandler(async (req, res) => {
	// get login details from frontend
	// find the user
	// check password
	// generate access token, refresh token
	// return both tokens via secure cookies

	const { email, password } = req.body;

	if (!email) {
		throw new ApiError(400, "email field required");
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new ApiError(404, "User does not exist");
	}

	const isPasswordCorrect = await user.isPasswordCorrect(password);

	if (!isPasswordCorrect) {
		throw new ApiError(401, "Invalid User Credientials");
	}

	const { accessToken, refreshToken } = await generateTokens(user._id);

	const loggedInUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);
	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.json(
			new ApiResponse(
				200,
				{
					user: loggedInUser,
					refreshToken,
					accessToken,
				},
				"User logged In successfully"
			)
		);
});

const logoutUser = asyncHandler(async (req, res) => {
	// clear cookies
	// clear refresh token from db
	const options = { httpOnly: true, secure: true };

	await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: { refreshToken: undefined },
		},
		{ new: true }
	);

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200, {}, "User logged out successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
	// this is how accessToken and refreshToken works
	//      first both are generated in server
	//      sent to the client side
	//
	//      accessToken is for a short period
	//      refreshToken is for long period
	//
	//      after the accesstoken is expired, the frontend gives refresh token to refresh access token
	//      then server checks if refresh token is valid or not if it is valid
	//      then server genereates new accesstoken and refreshtoken
	//      and returns in the form of cookies
	//
	//      or if the refresh token does not matches, the user is said to login again
	try {
		const incomingRefreshToken =
			req.cookies.refreshToken || req.body.refreshToken;

		if (!incomingRefreshToken) {
			throw new ApiError(401, "Unauthorized request");
		}
		const decodedToken = jwt.verify(
			incomingRefreshToken,
			process.env.ACCESS_TOKEN_SECRET
		);

		const user = await User.findById(decodedToken?._id);

		if (!user) {
			throw new ApiError(401, "Invalid Token");
		}

		if (incomingRefreshToken !== user?.refreshToken) {
			throw new ApiError(401, "Refresh token is expired or used");
		}

		const { refreshToken, accessToken } = await generateTokens(user._id);

		const options = { httpOnly: true, secure: true };

		return res
			.status(200)
			.cookie("accessToken", accessToken, options)
			.cookie("refreshToken", refreshToken, options)
			.json(
				new ApiResponse(
					200,
					{ accessToken, refreshToken },
					"Access Token refreshed "
				)
			);
	} catch (err) {
		throw new ApiError("Invalid refresh token");
	}
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
