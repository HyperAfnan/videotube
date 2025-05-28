import { validationResult } from "express-validator";
import { ApiError } from "../utils/apiErrors.js";

export const validator = (req, _, next) => {
	const errors = validationResult(req);
	console.log(errors);
	if (!errors.isEmpty()) throw new ApiError(400, errors.array()[0].msg);
	next();
};
