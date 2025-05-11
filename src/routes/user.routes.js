import { Router } from "express";
import {
	changePassword,
	getCurrentUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	registerUser,
	updateAccountDetails,
	updateUserAvatar,
	updateUserCoverImg,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
	upload.fields([
		{ name: "avatar", maxCount: 1 },
		{ name: "coverImage", maxCount: 1 },
	]),
	registerUser
);

router.route("/login").post(loginUser);

// secure route with jwt verification
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshToken").post(refreshAccessToken);

router.route("/updateDetails").post(verifyJWT, updateAccountDetails);

router
	.route("/updateAvatar")
	.post(
		verifyJWT,
		upload.fields([{ name: "avatar", maxCount: 1 }]),
		updateUserAvatar
	);

router
	.route("/updateCoverImage")
	.post(
		verifyJWT,
		upload.fields([{ name: "coverImage", maxCount: 1 }]),
		updateUserCoverImg
	);

router.route("/").get(verifyJWT, getCurrentUser);

router.route("/changePassword").post(verifyJWT, changePassword);

export default router;
