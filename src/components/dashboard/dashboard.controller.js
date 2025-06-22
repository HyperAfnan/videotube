import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/handlers.js";
import * as DashboardService from "./dashboard.service.js";
import { logger } from "../../utils/logger/index.js";

const dashboardLogger = logger.child({ module: "dashboard.controller" });

const getChannelStats = asyncHandler(async (req, res) => {
	const requestId = req.id;

	dashboardLogger.info(`[Request] ${requestId} Fetching channel stats`, {
		userId: req.user._id,
	});

	const stats = await DashboardService.getChannelStats(req.user._id);

	dashboardLogger.info(
		`[Request] ${requestId} Fetched channel stats successfully`,
		{
			userId: req.user._id,
		},
	);

	return res
		.status(200)
		.json(new ApiResponse(200, stats, "Successfully got channel stats"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
	const requestId = req.id;

	dashboardLogger.info(`[Request] ${requestId} Fetching channel videos`, {
		userId: req.user._id,
	});

	const channelVideos = await DashboardService.getChannelVideos(req.user._id);

	dashboardLogger.info(
		`[Request] ${requestId} Fetched channel videos successfully`,
		{
			userId: req.user._id,
			videoCount: Array.isArray(channelVideos) ? channelVideos.length : null,
		},
	);

	return res
		.status(200)
		.json(
			new ApiResponse(200, channelVideos, "Successfully got channel videos"),
		);
});

export { getChannelStats, getChannelVideos };
