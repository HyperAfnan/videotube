import { Worker } from "bullmq";
import { redisWorkerConnection as connection } from "../../config/redis.js";
import debug from "debug";
import { deleteUnVerifiedUsers } from "./user.processor.js";
const log = debug("app:worker:user:worker:log");
const error = debug("app:worker:user:worker:error");

const removeUnverfiedUserWorker = new Worker(
	"userQueue",
	async (job) => {
		try {
			log(`Processing user cleaning job ${job.id} with data:`, job.data);
			return await deleteUnVerifiedUsers();
		} catch (err) {
			error(`Error processing job ${job.id}:`, err);
			throw err;
		}
	},
	{
		connection,
		concurrency: 1,
	},
);

removeUnverfiedUserWorker.on("completed", (job) => {
	log(`User cleaning job ${job.id} completed successfully`);
});

removeUnverfiedUserWorker.on("failed", (job, err) => {
	error(`User cleaning job ${job.id} failed with error: ${err.message}`);
});

removeUnverfiedUserWorker.on("error", (err) => {
	error(`User cleaning worker encountered an error: ${err.message}`);
});
