import { User } from "../../components/user/user.model.js";
import { serviceHandler } from "../../utils/handlers.js";
import { logger } from "../../utils/logger/index.js";

export const deleteUnVerifiedUsers = serviceHandler(async () => {
	logger.info("Starting to delete unverified users");

	const result = await User.deleteMany({ isEmailConfirmed: false });

	if (!result.acknowledged) 
      logger.error("Failed to delete unerified users", { result: result });
});
