import IORedis from "ioredis";
import ENV from "./env.js";
import { logger } from "../utils/logger/index.js";

export const redisCacheConnection = new IORedis({
	host: ENV.REDIS_HOST,
	port: ENV.REDIS_PORT,
	maxRetriesPerRequest: null,
	enableReadyCheck: false
});

redisCacheConnection.on("connect", () => {
	logger.info(`Redis client connecting to ${ENV.REDIS_HOST}:${ENV.REDIS_PORT}`);
});

redisCacheConnection.on("ready", () => {
	logger.info(`Redis client connected successfully to ${ENV.REDIS_HOST}:${ENV.REDIS_PORT}`);
});

redisCacheConnection.on("error", (err) => {
	logger.error(`Redis client connection error: ${err.message}`);
});

redisCacheConnection.on("close", () => {
	logger.warn("Redis client connection closed");
});