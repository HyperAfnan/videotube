import winston from "winston";
import fs from "fs";
import path from "path";

const { timestamp, errors, json, combine, align } = winston.format;
const { File, Console } = winston.transports;

const logDir = path.join(process.cwd(), "logs");
fs.mkdirSync(logDir, { recursive: true });

export const productionLogger = winston.createLogger({
	level: "info",
	format: combine(errors({ stack: true }), align(), timestamp(), json()),
	transports: [
		new Console({ level: "info" }),
		new File({ filename: path.join(logDir, "combined.log"), level: "info" }),
		new File({ filename: path.join(logDir, "error.log"), level: "error" }),
		new File({ filename: path.join(logDir, "debug.log"), level: "debug" }),
	],
	exceptionHandlers: [
		new File({ filename: path.join(logDir, "exceptions.log") }),
	],
	rejectionHandlers: [
		new File({ filename: path.join(logDir, "rejections.log") }),
	],
	exitOnError: false,
});
