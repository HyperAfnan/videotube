import { asyncHandler } from "../../utils/handlers.js";

const health = asyncHandler(async (req, res) =>
	res.status(200).json({ status: "healthy" }),
);

export { health };
