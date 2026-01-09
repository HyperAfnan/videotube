import mongoose from "mongoose";
import ENV from "../config/env.js";
import { logger } from "../utils/logger/index.js";

export const requestLogger = (req, res, next) => {
	req.id = crypto.randomUUID();
	req.headers["x-request-id"] = req.id;
	res.set("x-request-id", req.id);

	mongoose.set("debug", (collectionName, method, query, doc) => {
		logger.debug(`[Request] ${req.id} MongoDB ${method}`, {
			collection: collectionName,
			query: JSON.stringify(query),
			doc: JSON.stringify(doc),
			queryTime: Date.now(),
		});
	});

	res.on("finish", () => {
		const status = res.statusCode;

      console.log(req.body)
		logger.log({
			level: ENV.LOG_LEVEL,
			message: `[Request]: ${req.id} ${req.method} ${status} ${req.originalUrl}`,
			meta: {
				requestId: req.id,
				ip: req.ip,
				userAgent: req.headers["user-agent"],
			},
		});
	});
	next();
};
