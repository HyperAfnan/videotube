import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/handlers.js";
import { User } from "../components/user/user.model.js";
import ENV from "../config/env.js";

export const verifyAccessToken = asyncHandler(async (req, _, next) => {
	try {
		const token =
			req.cookies?.accessToken ||
			req.header("Authorisation")?.replace("Bearer ", "");

		if (!token) throw new ApiError(401, "Unauthorized request");

		const decodedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);

		const user = await User.findById(decodedToken?._id).select(
			"-password -refreshToken",
		);

		if (!user) throw new ApiError(401, "Invalid Access Token");

		if (!user.isEmailConfirmed) throw new ApiError(401, "Email not confirmed");

		req.user = user;

		next();
	} catch (err) {
		throw new ApiError(401, "Invalid Access Token", {
			error: err.message,
			stack: err.stack,
		});
	}
});
