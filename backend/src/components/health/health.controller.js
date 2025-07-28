import { asyncHandler } from "../../utils/handlers.js";
import { logger } from "../../utils/logger/index.js";

const health = asyncHandler(async (req, res) => {
	logger.info(`[Request] ${req.id} - Health check request`);
	res.status(200).json({ status: "healthy" });
});

export { health };
