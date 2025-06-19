import ENV from "../config/env.js";
import { logger as log } from "../utils/logger/index.js";

export const requestLogger = (req, res, next) => {
	res.on("finish", () => {
		const status = res.statusCode;
		if (ENV.NODE_ENV === "development") {
			log.log({
				level: "debug",
				message: `${req.method} ${status} ${req.originalUrl}`,
				meta: {
					ip: req.ip,
					userAgent: req.headers["user-agent"],
				},
			});
		} else {
			log.log({
				level: "info",
				message: `${req.method} ${req.status} ${req.originalUrl}`,
				meta: {
					ip: req.ip,
					userAgent: req.headers["user-agent"],
				},
			});
		}
	});
	next();
};
