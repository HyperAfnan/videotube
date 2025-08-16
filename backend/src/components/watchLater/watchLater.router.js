import { Router } from "express";
import {
	addToWatchLater,
	removeFromWatchLater,
	getWatchLaterVideos,
	deleteAllWatchLaterVideos,
} from "./watchLater.controller.js";
import {
	addVideoToWatchLaterValidator,
	removeVideoFromWatchLaterValidator,
} from "./watchLater.validator.js";
import { verifyAccessToken } from "../../middlewares/auth.middleware.js";
import { defaultRateLimiter } from "../../middlewares/rateLimiter.middleware.js";
import { validator } from "../../middlewares/validator.middleware.js";

const router = Router();

router.use(defaultRateLimiter);
router.use(verifyAccessToken);

router.route("/").get(getWatchLaterVideos).delete(deleteAllWatchLaterVideos);

router
	.route("/:videoId")
	.put(addVideoToWatchLaterValidator, validator, addToWatchLater)
	.delete(removeVideoFromWatchLaterValidator, validator, removeFromWatchLater);

export default router;
