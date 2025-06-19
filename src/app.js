import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ENV from "./config/env.js";
import { logger } from "./utils/logger/index.js";
import { requestLogger } from "./middlewares/logger.js";

const app = express();

app.use(helmet());
app.set("trust proxy", 1);
app.use(cors({ credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(requestLogger)

if (ENV.NODE_ENV === "development") {
   logger.info("Development mode enabled");
	import("./config/bullboard.js")
		.then(({ setupBullBoard }) => setupBullBoard(app))
}

import userRoutes from "./components/user/user.routes.js";
import healthRoutes from "./components/health/health.routes.js";
import tweetRoutes from "./components/tweet/tweet.routes.js";
import subscriptionRoutes from "./components/subscription/subscription.routes.js";
import videoRoutes from "./components/video/video.routes.js";
import commentRoutes from "./components/comment/comment.routes.js";
import likeRoutes from "./components/like/like.routes.js";
import playlistRoutes from "./components/playlist/playlist.routes.js";
import dashboardRoutes from "./components/dashboard/dashboard.routes.js";

import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./utils/swagger.js";

app.get("/", (_, res) => res.redirect("/docs"));
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/playlist", playlistRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

export { app };
