import connectDB from "./config/db.js";
import { app } from "./app.js";
import mongoose from "mongoose";
import ENV from "./config/env.js";
import { logger } from "./utils/logger/index.js";
import { ConnectToRabbitMQ } from "./config/rabbit.js";

// import "./microservices/email/email.worker.js";
// import "./microservices/email/email.deadletter.worker.js";
// import "./microservices/user/user.worker.js";

const PORT = ENV.PORT || 5000;

logger.info("Connecting to database ...");
connectDB()
	.then(() =>
		logger.debug(
			`Database connected successfully ${mongoose.connection.host}:${mongoose.connection.port} - State: ${mongoose.connection.readyState}`,
		),
	)
	.catch((err) => logger.error("Database connection failed: %O", err));

ConnectToRabbitMQ()
	.then(() => logger.debug("RabbitMQ connected successfully"))
	.catch((err) => logger.error("RabbitMQ connection failed: %O", err));

app
	.listen(PORT, () => {
		logger.info(`App is running on port ${PORT}`);
	})
	.on("error", (error) => {
		console.log(error)
	});
