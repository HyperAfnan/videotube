// TODO: new Error wrapper

const logger = {};
import {
	writeError,
	writeLog,
	config,
	formatMessage,
	writeJsonLog,
} from "./utils.logger.js";

logger.config = config;

logger.createLogger = function (userConfig) {
	Object.assign(config, userConfig);
};

const datestamp = new Date().toDateString().split(" ").slice(1).join(" ");
const timestamp = new Date().toTimeString().split(" ")[0];

logger.log = async function (message, extra) {
	try {
		const log = formatMessage(timestamp, datestamp, "log", message);
		process.stdout.write(log);

		if (config.fileLogging) await writeLog(log);
		if (config.json && config.fileLogging)
			await writeJsonLog(message, "info", timestamp, datestamp, extra);
	} catch (error) {
		console.error("Error writing to log file:", error);
	}
};
logger.info = async function (message, extra) {
	try {
		const log = formatMessage(timestamp, datestamp, "info", message);
		process.stdout.write(log);

		if (config.fileLogging) await writeLog(log);
		if (config.json && config.fileLogging)
			await writeJsonLog(message, "info", timestamp, datestamp, extra);
	} catch (error) {
		console.error("Error writing to log file:", error);
	}
};

logger.warn = async function (message, extra) {
	try {
		const log = formatMessage(timestamp, datestamp, "warn", message);
		process.stdout.write(log);
		if (config.fileLogging) await writeLog(log);
		if (config.json && config.fileLogging)
			await writeJsonLog(message, "info", timestamp, datestamp, extra);
	} catch (error) {
		console.error("Error writing to log file:", error);
	}
};

logger.error = async function (message, extra) {
	try {
		const log = formatMessage(timestamp, datestamp, "error", message);
		process.stdout.write(log);

		if (config.fileLogging) await writeError(log);
		if (config.json && config.fileLogging)
			await writeJsonLog(message, "info", timestamp, datestamp, extra);
	} catch (error) {
		console.error("Error writing to log file:", error);
	}
};

class NewError extends Error {
	constructor(message) {
		super(message);
	}
}

export { logger, NewError };
