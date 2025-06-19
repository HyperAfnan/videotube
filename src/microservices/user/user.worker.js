import { Worker } from "bullmq";
import { redisWorkerConnection as connection } from "../../config/redis.js";
import { deleteUnVerifiedUsers } from "./user.processor.js";
import { logger } from "../../utils/logger/index.js";
const userWorkerLogger = logger.child({ module: "user.worker" });

const removeUnverfiedUserWorker = new Worker(
	"userQueue",
	async (job) => {
		try {
			userWorkerLogger.info(`Processing user cleaning job ${job.id} with data: ${job.data}`);
			return await deleteUnVerifiedUsers();
		} catch (err) {
         err.jobId = job.id;
         err.jobData = job.data;
			throw err;
		}
	},
	{
		connection,
		concurrency: 1,
	},
);

removeUnverfiedUserWorker.on("completed", (job) => {
	userWorkerLogger.info(`User cleaning job ${job.id} completed successfully`);
});

removeUnverfiedUserWorker.on("failed", (job, err) => {
   userWorkerLogger.error(`User cleaning worker encountered an error: ${err.message}`, { error: err, jobId: job.id, jobData: job.data });
});

removeUnverfiedUserWorker.on("error", (err) => {
	userWorkerLogger.error(`User cleaning worker encountered an error: ${err.message}`);
});
