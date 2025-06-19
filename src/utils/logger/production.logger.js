import winston from "winston";
import fs from "fs";
import path from "path";

const { timestamp, errors, json, combine } = winston.format;
const { File } = winston.transports;

const logDir = path.join(process.cwd(), "logs");
fs.mkdirSync(logDir, { recursive: true });

export const productionLogger = winston.createLogger({
	level: "info",
	format: combine(errors({ stack: true }), timestamp(), json()),
	transports: [
		new File({ filename: path.join(logDir, "combined.log") }),
		new File({ filename: path.join(logDir, "error.log"), level: "error" }),
	],
	exceptionHandlers: [
		new File({ filename: path.join(logDir, "exceptions.log") }),
	],
	rejectionHandlers: [
		new File({ filename: path.join(logDir, "rejections.log") }),
	],
	exitOnError: false,
});
