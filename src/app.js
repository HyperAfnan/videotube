import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.set("trust proxy", 1);
app.use(cors({ credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		limit: 100,
		message: { error: "Too many requests, rate limit exceeded" },
	})
);

import userRoutes from "./components/user/api/user.routes.js";
import healthRoutes from "./components/health/api/health.routes.js";
import tweetRoutes from "./components/tweet/api/tweet.routes.js";
import subscriptionRoutes from "./components/subscription/api/subscription.routes.js";
import videoRoutes from "./components/video/api/video.routes.js";
import commentRoutes from "./components/comment/api/comment.routes.js";
import likeRoutes from "./components/like/api/like.routes.js";
import playlistRoutes from "./components/playlist/api/playlist.routes.js";
import dashboardRoutes from "./components/dashboard/api/dashboard.routes.js";
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./utils/swagger.js";

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app
	.listen(PORT, () => {
		console.log(`App is running on port ${PORT}`);
	})
	.on("error", (error) => {
		console.error("Failed to start server:", error.message);
	});

export { app };
