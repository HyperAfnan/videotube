import { developmentLogger } from "./development.logger.js";
import { productionLogger } from "./production.logger.js";
import ENV from "../../config/env.js";

export const logger =
	ENV.NODE_ENV === "development" ? developmentLogger : productionLogger;
