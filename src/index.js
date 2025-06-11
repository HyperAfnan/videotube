import debug from "debug";
import connectDB from "./config/db.js";
import { app } from "./app.js";
import mongoose from "mongoose";
import ENV from "./config/env.js";

const startupDebug = debug("app:startup");
const dbDebug = debug("app:db");

import "./microservices/email/email.worker.js";
import "./microservices/email/email.deadletter.worker.js";
import "./microservices/user/user.worker.js";

const PORT = ENV.PORT || 5000;

startupDebug("Starting the application...");
connectDB()
	.then(() =>
		dbDebug(
			"Database connected successfully %O",
			mongoose.connection.readyState,
		),
	)
	.catch((err) => dbDebug("Database connection failed: %O", err));

app
	.listen(PORT, () => {
		startupDebug(`App is running on port ${PORT}`);
	})
	.on("error", (error) => {
		startupDebug("Server error: %O", error);
	});
