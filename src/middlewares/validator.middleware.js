import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiErrors.js";
import { logger } from "../utils/logger/index.js";

const validatorLogger = logger.child({ module: "validator" });

export const validator = (req, _, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorMsg = errors.array()[0].msg;
		validatorLogger.warn("Validation failed", {
			path: req.path,
			method: req.method,
			error: errorMsg,
			validationErrors: errors.array(),
		});
		throw new ApiError(400, errorMsg);
	}
	validatorLogger.info("Validation passed", {
		path: req.path,
		method: req.method,
	});
	next();
};
