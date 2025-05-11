import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ credentials: true }));
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: true, limit: "32kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());

import userRouter from "./routes/user.routes.js";
import healthRouter from "./routes/health.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/health", healthRouter);

app
	.listen(PORT, () => {
		console.log(`App is running on port ${PORT}`);
	})
	.on("error", (error) => {
		console.error("Failed to start server:", error.message);
	});

export { app };
