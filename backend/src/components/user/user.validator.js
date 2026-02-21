import { ExpressValidator, oneOf } from "express-validator";
import { ApiError } from "../../utils/apiErrors.js";

const { body, param } = new ExpressValidator({
	checkWhitespace: (value) => {
		for (let i = 0; i < value?.length; i++) {
			if (value[i] === " ") return false;
		}
		return true;
	},
	isfirstLetterLowercase: (value) =>
		value.charAt(0) === value.charAt(0).toLowerCase(),
});

export const updateAccountDetailsValidator = [
	oneOf(
		[
			body("fullname").isString().withMessage("Name must be a string").trim(),
			body("username")
				.isString()
				.withMessage("Username must be a string")
				.isfirstLetterLowercase()
				.isLength({ min: 3, max: 15 })
				.withMessage("Username must between 3-15 characters")
				.checkWhitespace(),
		],
		{ message: "Atleast one field is required to update" },
	),
];

export const avatarFileValidator = (req, _, next) => {
	try {
		if (!req.file || !req.file.path)
			throw new ApiError(400, "Avatar image is required");

		next();
	} catch (error) {
		next(error);
	}
};

export const coverImageFileValidator = (req, _, next) => {
	try {
		if (!req.file || !req.file.path)
			throw new ApiError(400, "Cover image is required");

		next();
	} catch (error) {
		next(error);
	}
};

export const getUserChannelProfileValidator = [
	param("username")
		.optional()
		.isString()
		.withMessage("Username must be a string")
		.isfirstLetterLowercase()
		.withMessage("first letter of username should be lowercase")
		.trim(),
];
