import IORedis from "ioredis";
import ENV from "./env.js";

const isTLS = ENV.NODE_ENV === "production";

export const redisQueueConnection = new IORedis({
	host: ENV.REDIS_HOST,
	port: ENV.REDIS_PORT,
	tls: isTLS ? {} : undefined,
	retryStrategy: (times) => {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
});

export const redisWorkerConnection = new IORedis({
	host: ENV.REDIS_HOST,
	port: ENV.REDIS_PORT,
	tls: isTLS ? {} : undefined,
	maxRetriesPerRequest: null,
	retryStrategy: (times) => {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
});
