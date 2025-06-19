import fs from "fs/promises";
import path from "path";

export const config = {
	logFile: "combined.log",
	errorFile: "error.log",
	colored: false,
	json: false,
	fileLogging: false,
};

export const ansiCodes = {
	// Text attributes
	"All attributes off (color at startup)": "\x1b[0m",
	"Bold on (enable foreground intensity)": "\x1b[1m",
	"Underline on": "\x1b[4m",
	"Blink on (enable background intensity)": "\x1b[5m",
	"Bold off (disable foreground intensity)": "\x1b[21m",
	"Underline off": "\x1b[24m",
	"Blink off (disable background intensity)": "\x1b[25m",

	// Foreground colors
	"Black (foreground)": "\x1b[30m",
	"Red (foreground)": "\x1b[31m",
	"Green (foreground)": "\x1b[32m",
	"Yellow (foreground)": "\x1b[33m",
	"Blue (foreground)": "\x1b[34m",
	"Magenta (foreground)": "\x1b[35m",
	"Cyan (foreground)": "\x1b[36m",
	"White (foreground)": "\x1b[37m",
	"Default (foreground color at startup)": "\x1b[39m",
	"Light Gray (foreground)": "\x1b[90m",
	"Light Red (foreground)": "\x1b[91m",
	"Light Green (foreground)": "\x1b[92m",
	"Light Yellow (foreground)": "\x1b[93m",
	"Light Blue (foreground)": "\x1b[94m",
	"Light Magenta (foreground)": "\x1b[95m",
	"Light Cyan (foreground)": "\x1b[96m",
	"Light White (foreground)": "\x1b[97m",

	// Background colors
	"Black (background)": "\x1b[40m",
	"Red (background)": "\x1b[41m",
	"Green (background)": "\x1b[42m",
	"Yellow (background)": "\x1b[43m",
	"Blue (background)": "\x1b[44m",
	"Magenta (background)": "\x1b[45m",
	"Cyan (background)": "\x1b[46m",
	"White (background)": "\x1b[47m",
	"Default (background color at startup)": "\x1b[49m",
	"Light Gray (background)": "\x1b[100m",
	"Light Red (background)": "\x1b[101m",
	"Light Green (background)": "\x1b[102m",
	"Light Yellow (background)": "\x1b[103m",
	"Light Blue (background)": "\x1b[104m",
	"Light Magenta (background)": "\x1b[105m",
	"Light Cyan (background)": "\x1b[106m",
	"Light White (background)": "\x1b[107m",
};

const logDir = path.join("", "logs");

async function ensureLogDir() {
	try {
		await fs.mkdir(logDir, { recursive: true });
	} catch (err) {
		console.error("Failed to create log directory:", err);
		throw err;
	}
}

export const writeLog = async (message) => {
	try {
		ensureLogDir();
		await fs.writeFile(path.join(logDir, config.logFile), message, {
			flag: "a",
		});
	} catch (error) {
		process.stdout.write(`Error writing to file: ${error.message}\n`);
	}
};

export const writeError = async (message) => {
	try {
		ensureLogDir();

		await fs.writeFile(path.join(logDir, config.errorFile), message, {
			flag: "a",
		});
		await fs.writeFile(path.join(logDir, config.logFile), message, {
			flag: "a",
		});
	} catch (error) {
		process.stdout.write(`Error writing to file: ${error.message}\n`);
	}
};

export const writeJsonLog = async (
	message,
	level,
	timestamp,
	datestamp,
	extra,
) => {
	try {
		const logEntry = {
			level,
			time: timestamp + " " + datestamp,
			message,
			...(extra && { extra }),
		};
		const log = JSON.stringify(logEntry);
		await fs.writeFile(path.join(logDir, "combined.json"), log + "\n", {
			flag: "a",
		});
	} catch (error) {
		process.stdout.write(`Error writing to file: ${error.message}\n`);
	}
};

export const formatMessage = (timestamp, datestamp, level, message) => {
	const logColoredLabel = `${ansiCodes["Green (foreground)"]}[log]${ansiCodes["All attributes off (color at startup)"]}`;
	const logColoredMessage = `${ansiCodes["Light Green (foreground)"]}${message}${ansiCodes["All attributes off (color at startup)"]}`;
	const infoColoredLabel = `${ansiCodes["Blue (foreground)"]}[info]${ansiCodes["All attributes off (color at startup)"]}`;
	const infoColoredMessage = `${ansiCodes["Light Blue (foreground)"]}${message}${ansiCodes["All attributes off (color at startup)"]}`;
	const warnColoredLabel = `${ansiCodes["Yellow (foreground)"]}[warn]${ansiCodes["All attributes off (color at startup)"]}`;
	const warnColoredMessage = `${ansiCodes["Light Yellow (foreground)"]}${message}${ansiCodes["All attributes off (color at startup)"]}`;
	const errorColoredLabel = `${ansiCodes["Red (foreground)"]}[error]${ansiCodes["All attributes off (color at startup)"]}`;
	const errorColoredMessage = `${ansiCodes["Light Red (foreground)"]}${message}${ansiCodes["All attributes off (color at startup)"]}`;

	let coloredLabel, coloredMessage;
	switch (level) {
		case "log":
			coloredLabel = logColoredLabel;
			coloredMessage = logColoredMessage;
			break;
		case "info":
			coloredLabel = infoColoredLabel;
			coloredMessage = infoColoredMessage;
			break;
		case "warn":
			coloredLabel = warnColoredLabel;
			coloredMessage = warnColoredMessage;
			break;
		case "error":
			coloredLabel = errorColoredLabel;
			coloredMessage = errorColoredMessage;
			break;
		default:
			coloredLabel = logColoredLabel;
			coloredMessage = logColoredMessage;
	}

	let log;
	if (config.colored)
		log = `${coloredLabel} ${datestamp} ${timestamp} - ${coloredMessage}\n`;
	else log = `[${level}] ${datestamp} ${timestamp} - ${message} \n`;

	return log;
};
