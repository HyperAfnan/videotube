import { Router } from "express";
import {
	changePassword,
	deleteUser,
	getCurrentUser,
	getUserChannelProfile,
	getUserWatchHistory,
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

router.route("/updateDetails").patch(verifyJWT, updateAccountDetails);

router
	.route("/updateAvatar")
	.patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
	.route("/updateCoverImage")
	.patch(verifyJWT, upload.single("coverImage"), updateUserCoverImg);

router.route("/").get(verifyJWT, getCurrentUser);

router.route("/changePassword").patch(verifyJWT, changePassword);

router.route("/history").get(verifyJWT, getUserWatchHistory);

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

router.route("/delete").get(verifyJWT, deleteUser);

export default router;
