import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ENV from "./config/env.js";
import { logger } from "./utils/logger/index.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import compression from "compression";

const app = express();

app.use(helmet());
app.set("trust proxy", 1); // required for rate limiter
app.use(
	cors({
		origin: "*",
		credentials: true,
	}),
);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(requestLogger);
app.use(compression());

if (ENV.NODE_ENV === "development") {
	logger.info("Development mode enabled");
	import("./config/bullboard.js").then(({ setupBullBoard }) =>
		setupBullBoard(app),
	);
}

import userRoutes from "./components/user/user.route.js";
import authRoutes from "./components/auth/auth.route.js";
import healthRoutes from "./components/health/health.route.js";
import tweetRoutes from "./components/tweet/tweet.route.js";
import subscriptionRoutes from "./components/subscription/subscription.route.js";
import videoRoutes from "./components/video/video.route.js";
import commentRoutes from "./components/comment/comment.route.js";
import likeRoutes from "./components/like/like.route.js";
import playlistRoutes from "./components/playlist/playlist.route.js";
import dashboardRoutes from "./components/dashboard/dashboard.route.js";

import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./utils/swagger.js";

app.get("/", (_, res) => res.redirect("/docs"));
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorHandler);

export { app };
