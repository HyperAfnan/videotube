import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as DashboardService from "./dashboard.service.js";

const getChannelStats = asyncHandler(async (req, res) => {
	const stats = await DashboardService.getChannelStats(req.user._id);
	return res
		.status(200)
		.json(new ApiResponse(200, stats, "Successfully got channel stats"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
	const channelVideos = await DashboardService.getChannelVideos(req.user._id);
	return res
		.status(200)
		.json(
			new ApiResponse(200, channelVideos, "Successfully got channel videos"),
		);
});

export { getChannelStats, getChannelVideos };
