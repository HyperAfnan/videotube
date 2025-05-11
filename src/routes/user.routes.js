import { Router } from "express";
import {
	loginUser,
	logoutUser,
	refreshAccessToken,
	registerUser,
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

export default router;
