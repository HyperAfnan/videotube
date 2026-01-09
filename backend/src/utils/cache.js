import { redisCacheConnection } from "../config/redis.js";
import { logger } from "../utils/logger/index.js";

const cacheLogger = logger.child({ module: "cache" });

export const createCacheKey = (keyHead, keyParts = []) => {
   cacheLogger.debug(`Creating cache key with head: ${keyHead} and parts: ${keyParts}`);
  return [keyHead, ...keyParts].join(":");
};

export const cacheValue = async (key, value, ex, nx = false) => {
   cacheLogger.debug(`Caching value for key: ${key} with expiration: ${ex} and NX: ${nx}`);
   const result = await redisCacheConnection.set(key, JSON.stringify(value), "EX", ex ? ex : 3600, nx ? 'NX' : undefined);
	return result;
}

export const isCached = async (key) => {
   cacheLogger.debug(`Checking if key is cached: ${key}`);
  const result = await redisCacheConnection.get(key);
  return result !== null;
};

export const getCachedValue = async (key) => {
   cacheLogger.debug(`Retrieving cached value for key: ${key}`);
  const result = await redisCacheConnection.get(key);
  return result ? JSON.parse(result) : null;
}
