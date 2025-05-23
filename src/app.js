import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', true);
app.use(cors({ credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		limit: 100,
		legacyHeaders: true,
		message: { error: "Too many requests, rate limit exceeded" },
	})
);

app.disable("x-powered-by");

import userRouter from "./routes/user.routes.js";
import healthRouter from "./routes/health.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./utils/swagger.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app
	.listen(PORT, () => {
		console.log(`App is running on port ${PORT}`);
	})
	.on("error", (error) => {
		console.error("Failed to start server:", error.message);
	});

export { app };
