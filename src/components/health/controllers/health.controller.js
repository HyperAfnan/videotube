import asyncHandler from "../../../utils/asyncHandler.js";

const health = asyncHandler(async (req, res) => {
	return res.status(200).json({ status: "healthy" });
});

export { health };
