import { body, cookie, param } from "express-validator";
import { ApiError } from "../../utils/apiErrors.js";
import { User } from "./user.models.js";
import jwt from "jsonwebtoken";

function checkWhitespace(value) {
	for (let i = 0; i < value.length; i++) {
		if (value[i] === " ") throw new ApiError(400, "no whitespace allowed");
	}
	return true;
}

async function verifyRefreshToken(value) {
	const decodedToken = jwt.verify(value, process.env.REFRESH_TOKEN_SECRET);

	const user = await User.findById(decodedToken?._id);
	if (!user) throw new ApiError(401, "Invalid Token");
	if (value !== user?.refreshToken)
		throw new ApiError(401, "Refresh token is expired or used");

	return true;
}

// BUG:if any character of username is in uppercase, it will throw an error
export const registerValidator = [
	body("fullName")
		.notEmpty()
		.withMessage("Fulllname is required")
		.isString()
		.withMessage("Name must be a string")
		.trim(),

	body("email")
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email format")
		.trim()
		.custom(checkWhitespace)
		.custom(async (email) => {
			const existingUser = await User.findOne({ email });
			if (existingUser)
				throw new ApiError("A user already exists with this e-mail address");
		}),

	body("username")
		.notEmpty()
		.withMessage("Username is required")
		.isString()
		.withMessage("Username must be a string")
		.isLowercase()
		.withMessage("Username must be in lowercase")
		.trim()
		.isLength({ min: 3, max: 12 })
		.withMessage("Username must between 3-12 characters")
		.custom(checkWhitespace)
		.custom(async (username) => {
			const existingUser = await User.findOne({ username });
			if (existingUser)
				throw new ApiError("A user already exists with this username");
		}),

	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.isString()
		.withMessage("Password must be a string")
		.trim(),
];

export const registerationFilesValidator = (req, _, next) => {
	try {
		if (
			!req.files ||
			!req.files.avatar ||
			!req.files.avatar[0] ||
			!req.files.avatar[0].path
		)
			throw new ApiError(400, "Avatar image is required");

		if (
			req.files.coverImage &&
			(!req.files.coverImage[0] || !req.files.coverImage[0].path)
		) {
			throw new ApiError(400, "Invalid cover image provided");
		}

		next();
	} catch (error) {
		next(error);
	}
};

export const confirmEmailValidator = [
	param("confirmationToken")
		.notEmpty()
		.withMessage("Confirmation token is required")
		.isString()
		.withMessage("Confirmation token must be a string")
		.isJWT()
		.withMessage("Invalid confirmation token format"),
];

export const confirmationTokenValidator = async (req, _, next) => {
	try {
		const token = req.params.ConfirmationToken;
		const decodedToken = jwt.verify(
			token,
			process.env.CONFIRMATION_TOKEN_SECRET,
		);
		const user = await User.findById(decodedToken?._id);
		if (!user) throw new ApiError(401, "Invalid confirmation token");
		if (user.isEmailConfirmed)
			throw new ApiError(400, "Email is already confirmed");

		req.user = user;
		next();
	} catch (error) {
		throw new ApiError(401, "Invalid confirmation token");
	}
};

export const loginValidator = [
	body("username")
		.notEmpty()
		.withMessage("Username is required")
		.isString()
		.withMessage("Username must be a string")
		.trim()
		.isLength({ min: 3, max: 12 })
		.withMessage("Username must between 3-12 characters")
		.custom(checkWhitespace),
	body("password")
		.notEmpty()
		.withMessage("Password is required")
		.isString()
		.withMessage("Password must be a string")
		.trim(),
];

export const refreshAccessTokenValidator = [
	body("refreshToken")
		.optional()
		.isJWT()
		.withMessage("Invalid token format")
		.custom(verifyRefreshToken),
	cookie("refreshToken")
		.optional()
		.isJWT()
		.withMessage("Invalid token format")
		.custom(verifyRefreshToken),
];

export const changePasswordValidator = [
	body("oldPassword")
		.notEmpty()
		.withMessage("Old Password field is required")
		.isString()
		.withMessage("Old Password field must be string")
		.trim(),
	body("newPassword")
		.notEmpty()
		.withMessage("New Password field is required")
		.isString()
		.withMessage("New Password field must be string")
		.trim(),
];

export const updateAccountDetailsValidator = [
	body("fullName").isString().withMessage("Name must be a string").trim(),

	body("username")
		.isString()
		.withMessage("Username must be a string")
		.isLowercase()
		.withMessage("Username must be in lowercase")
		.trim()
		.isLength({ min: 3, max: 12 })
		.withMessage("Username must between 3-12 characters")
		.custom(checkWhitespace)
		.custom(async (username) => {
			const existingUser = await User.findOne({ username });
			if (existingUser)
				throw new ApiError("A user already exists with this username");
		}),
	body("").custom((body) => {
		if (!body.fullName && !body.username)
			throw new ApiError(400, "Atleast one field is required to update");
	}),
];
export const avatarFileValidator = (req, _, next) => {
	try {
		if (!req.file || !req.file.path)
			throw new ApiError(400, "Avatar image is required");

		next();
	} catch (error) {
		next(error);
	}
};

export const coverImageFileValidator = (req, _, next) => {
	try {
		if (!req.file || !req.file.path)
			throw new ApiError(400, "Cover image is required");

		next();
	} catch (error) {
		next(error);
	}
};

export const getUserChannelProfileValidator = [
	param("username")
		.optional()
		.isString()
		.withMessage("Username must be a string")
		.isLowercase()
		.withMessage("Username must be in lowercase")
		.trim(),
];

export const usernameValidator = async (req, _, next) => {
	const { username } = req.params;
	const user = User.find({ username });
	if (!user) username = req.user.username;

	req.username = username;
	next();
};
