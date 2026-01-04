import { Comment } from "../comment/comments.model.js";
import { Subscription } from "../subscription/subscription.model.js";
import { Like } from "../like/like.model.js";
import { Playlist } from "../playlist/playlist.model.js";
import { Video } from "../video/video.model.js";
import { Tweet } from "../tweet/tweet.model.js";
import { serviceHandler } from "../../utils/handlers.js";
import { ApiError } from "../../utils/apiErrors.js";
import {
	deleteImageOnCloudinary,
	uploadImageOnCloudinary,
} from "../../utils/fileHandlers.js";
// import emailQueue from "../../jobs/queues/email/email.normal.js";
// import userQueue from "../../jobs/queues/user/user.normal.js";
// import { templates } from "../../microservices/email/email.templates.js";
import ENV from "../../config/env.js";
import jwt from "jsonwebtoken";
import { logger } from "../../utils/logger/index.js";
import * as RedisCache from "../../utils/cache.js"
import { User } from "../user/user.model.js";
import { channel } from "../../config/rabbit.js";
const authServiceLogger = logger.child({ module: "auth.services" });

async function generateTokens(user) {
	const accessToken = await user.generateAccessToken();
	const refreshToken = await user.generateRefreshToken();

	user.refreshToken = refreshToken;
	await user.save({ validateBeforeSave: false });

	return { accessToken, refreshToken };
}

async function generateConfirmationToken(user) {
	const confirmationToken = await user.generateConfirmationToken();

	user.confirmationToken = confirmationToken;
	await user.save({ validateBeforeSave: false });

	return { confirmationToken };
}

async function generateForgotPasswordToken(user) {
	const forgotPasswordToken = await user.generateForgotPasswordToken();

	user.forgotPasswordToken = forgotPasswordToken;
	await user.save({ validateBeforeSave: false });

	return { forgotPasswordToken };
}

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

const findUserByToken = serviceHandler(async (token, tokenType) => {
	let decodedToken;
	if (tokenType === "cft")
		decodedToken = jwt.verify(token, ENV.CONFIRMATION_TOKEN_SECRET);
	else if (tokenType === "rft")
		decodedToken = jwt.verify(token, ENV.REFRESH_TOKEN_SECRET);

	const user = await User.findById(decodedToken?._id);

	return user;
});

export const isRefreshTokenValid = serviceHandler(async (token) => {
	const user = await findUserByToken(token, "rft");
	if (!user) return { status: false, message: "Invalid Refresh Token" };

	return { status: true, message: "Refresh Token is valid ", userMeta: user };
});

export const isConfirmationTokenValid = serviceHandler(
	async (confirmationToken) => {
		const user = await findUserByToken(confirmationToken, "cft");

		if (user.isEmailConfirmed)
			return { status: false, message: "Email is already confirmed" };
		if (!user) return { status: false, message: "Invalid Confirmation Token" };

		return {
			status: true,
			message: "Confirmation Token is valid",
			userMeta: user,
		};
	},
);

export const sendEmailToUser = serviceHandler(async (userMeta) => {
	// const { confirmationToken } = await generateConfirmationToken(userMeta);

	// const { subject, html } = templates.registration(
	// 	userMeta.username,
	// 	confirmationToken,
	// );

	// await emailQueue.add(
	// 	"registrationEmail",
	// 	{ to: userMeta.email, html, subject },
	// 	{ removeOnComplete: true, removeOnFail: true },
	// );

   // publish to rabbitmq
   const emailData = { to: userMeta.email, /* html, subject */ };
   channel.sendToQueue(
      "email_queue",
      Buffer.from(JSON.stringify({ type: "registrationEmail", data: emailData })),
      { persistent: true },
   );
   
   authServiceLogger.info("Confirmation email sent", {
      userId: userMeta._id,
      email: userMeta.email,
   });
});

export const registerUser = serviceHandler(
	async (
		fullname,
		email,
		username,
		password,
		avatarLocalPath,
		coverImageLocalPath,
	) => {
		let coverImage;
		if (coverImageLocalPath)
			coverImage = await uploadImageOnCloudinary(coverImageLocalPath);

		const altAvatar =
			"https://res.cloudinary.com/cloud6969/image/upload/v1753970395/ytncii8p8rojtdkilzko_pmpq7v.webp";
		let avatarImage;
		if (avatarLocalPath)
			avatarImage = await uploadImageOnCloudinary(coverImageLocalPath);

		const user = await User.create({
			fullname,
			email,
			avatar: avatarImage?.secure_url || altAvatar,
			coverImage: coverImage?.secure_url || "",
			username,
			password,
		});

		const createdUser = await User.findById(user._id).select(
			"-password -refreshToken",
		);

		if (!createdUser) {
			throw new ApiError(500, "User creation failed in DB ", { email });
		}

		authServiceLogger.info("User created in DB", {
			userId: user._id,
			email: user.email,
		});

      const { confirmationToken } = await generateConfirmationToken(userMeta);

      const { subject, html } = templates.registration(
         userMeta.username,
         confirmationToken,
      );

      // await emailQueue.add(
      //    "registrationEmail",
      //    { to: userMeta.email, html, subject },
      //    { removeOnComplete: true, removeOnFail: true },
      // );


      // cache the created user profile with pending status
      const cacheKey = RedisCache.createCacheKey("user", ["profile", "pending" ,user._id]);
      await RedisCache.cacheValue(cacheKey, createdUser);


		// await userQueue.add(
		// 	"removeUnverifiedUser",
		// 	{},
		// 	{ delay: 3600000, attempts: 1 },
		// );

		return createdUser;
	},
);

export const confirmEmail = serviceHandler(async (userMeta) => {
	const user = await User.findByIdAndUpdate(
		userMeta,
		{ isEmailConfirmed: true, confirmationToken: null },
		{ new: true },
	);
	const { accessToken, refreshToken } = await generateTokens(user);

	authServiceLogger.info("Account verified", {
		userId: userMeta._id,
		username: userMeta.username,
	});

	// const { subject, html } = templates.welcome(userMeta.username);
	// await emailQueue.add(
	// 	"welcome",
	// 	{ to: userMeta.email, html, subject },
	// 	{ removeOnComplete: true, removeOnFail: true },
	// );

	return { accessToken, refreshToken };
});

export const forgotPassword = serviceHandler(async (email) => {
	const user = await findUserByEmail(email);
	if (!user) {
		throw new ApiError(404, "User Not Found", { email });
	}

	const { forgotPasswordToken } = await generateForgotPasswordToken(user);

	// const { subject, html } = templates.resetPassword(forgotPasswordToken);

	authServiceLogger.info("Forgot password request", { email });
	// await emailQueue.add(
	// 	"resetPassword",
	// 	{ to: user.email, html, subject },
	// 	{ removeOnComplete: true, removeOnFail: true },
	// );
});

export const loginUser = serviceHandler(async (email, password) => {
	const user = await findUserByEmail(email);
	if (!user) {
		throw new ApiError(404, "User not found", { email });
	}

   // TODO: remove the comments before full deployment
	// if (!user.isEmailConfirmed) {
	// 	throw new ApiError(401, "Email not confirmed", { email });
	// }
	//
	const isPasswordCorrect = await user.isPasswordCorrect(password);
	if (!isPasswordCorrect) throw new ApiError(401, "Incorrect Password", { email });

	const { accessToken, refreshToken } = await generateTokens(user);

	const loggedInUser = await User.findById(user._id).select(
		"-password -refreshToken -confirmationToken -forgotPasswordToken -__v -updatedAt -isEmailConfirmed",
	);

	authServiceLogger.info("User logged in", {
		userId: loggedInUser._id,
		username: loggedInUser.username,
	});

	return { data: { user: loggedInUser, accessToken }, refreshToken };
});

export const logoutUser = serviceHandler(async (userId) => {
	authServiceLogger.info("User logged out", { userId });
	await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
});

export const deleteUser = serviceHandler(async (userId) => {
	const user = await User.findByIdAndDelete(userId);

	if (user?.coverImage) await deleteImageOnCloudinary(user.coverImage);
	await deleteImageOnCloudinary(user?.avatar);
	await Comment.deleteMany({ user: userId });
	await Subscription.deleteMany({
		$or: [{ channel: userId }, { subscriber: userId }],
	});
	await Like.deleteMany({ user: userId });
	await Playlist.deleteMany({ owner: userId });
	await Video.deleteMany({ owner: userId });
	await Tweet.deleteMany({ user: userId });

	authServiceLogger.info("User account deleted", { userId });
});

export const refreshAccessToken = serviceHandler(async (userId) => {
	const user = await User.findById(userId);
	const { refreshToken, accessToken } = await generateTokens(user);
	authServiceLogger.info("Access token refreshed", {
		userId: user._id,
		username: user.username,
	});
	return { refreshToken, accessToken };
});

export const resetPassword = serviceHandler(async (token, newPassword) => {
	const decodedToken = jwt.verify(token, ENV.FORGET_PASSWORD_TOKEN_SECRET);

	const user = await User.findById(decodedToken?._id);

	if (!user) {
		throw new ApiError(404, "User not found", { userId: decodedToken?._id });
	}

	user.password = newPassword;
	user.forgotPasswordToken = null;
	await user.save({ validateBeforeSave: false });

	authServiceLogger.info("Password reset", {
		userId: user._id,
		username: user.username,
	});
});

export const changePassword = serviceHandler(
	async (userId, oldPassword, newPassword) => {
		const user = await User.findById(userId);
		const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
		if (!isPasswordCorrect) {
			throw new ApiError(400, "Invalid Password");
		}

		user.password = newPassword;
		await user.save({ validateBeforeSave: false });

		authServiceLogger.info("Password changed", {
			userId: user._id,
			username: user.username,
		});
	},
);
