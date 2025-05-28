import { config } from "dotenv";
config();

import debug from "debug";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import mongoose from "mongoose";

const startupDebug = debug("app:startup");
const dbDebug = debug("app:db");

const PORT = process.env.PORT || 5000;

startupDebug("Starting the application...");
connectDB()
	.then(() =>
		dbDebug(
			"Database connected successfully %O",
			mongoose.connection.readyState
		)
	)
	.catch((err) => dbDebug("Database connection failed: %O", err));

app
	.listen(PORT, () => {
		startupDebug(`App is running on port ${PORT}`);
		console.log(`App is running on port ${PORT}`);
	})
	.on("error", (error) => {
		startupDebug("Server error: %O", error);
		console.error("Failed to start server:", error.message);
	});
