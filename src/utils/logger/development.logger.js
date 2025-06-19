import winston from "winston";
import fs from "fs";
import path from "path";
const { colorize, timestamp, printf, combine, errors, json, align } =
	winston.format;
const { Console, File } = winston.transports;

const logDir = path.join(process.cwd(), "logs");
fs.mkdirSync(logDir, { recursive: true });

export const developmentLogger = winston.createLogger({
	level: "debug",
	format: combine(
		errors({ stack: true }),
		colorize(),
		align(),
		timestamp({ format: "DD June HH-mm:ss" }),
		printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`),
	),
	transports: [
		new Console(),
		new File({ filename: path.join(logDir, "combined.log") }),
		new File({ filename: path.join(logDir, "error.log"), level: "error" }),
		new File({
			filename: path.join(logDir, "combined.json"),
			format: combine(errors({ stack: true }), timestamp(), json()),
		}),
		new File({
			level: "error",
			filename: path.join(logDir, "error.json"),
			format: combine(errors({ stack: true }), timestamp(), json()),
		}),
	],
	exceptionHandlers: [
		new Console(),
		new File({ filename: path.join(logDir, "exceptions.log") }),
	],
	rejectionHandlers: [
		new Console(),
		new File({ filename: path.join(logDir, "rejections.log") }),
	],
	exitOnError: false,
});
