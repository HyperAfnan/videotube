import winston from "winston";
const { timestamp, errors, json, combine, align } = winston.format;
const { Console } = winston.transports;
import ENV from "../../config/env.js";

export const productionLogger = winston.createLogger({
	level: ENV.LOG_LEVEL,
	format: combine(errors({ stack: true }), align(), timestamp(), json()),
	transports: [
		new Console({ level: "info" }),
	],
	exitOnError: false,
});
