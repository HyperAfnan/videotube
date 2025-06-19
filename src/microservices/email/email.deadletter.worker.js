import { Worker } from "bullmq";
import { redisWorkerConnection as connection } from "../../config/redis.js";
import { sendEmail } from "./email.processor.js";
import { logger } from "../../utils/logger/index.js"

const emailDeadLetterWorker = new Worker(
	"emailDeadLetterQueue",
	async (job) => {
		const { to, subject, html } = job.data || {};
		if (!to || !subject || !html) {
			throw new Error("Missing required email fields in job data");
		}
		logger.info(`Dead letter worker started for job ${job.id}`);
		try {
			await sendEmail(to, subject, html);
		} catch (err) {
         err.jobId = job.id;
         err.jobData = job.data;
			throw err;
		}
	},
	{
		connection,
		concurrency: 10,
		limiter: {
			max: 40,
			duration: 24 * 60 * 60 * 1000,
		},
	},
);

emailDeadLetterWorker.on("completed", (job) => {
	logger.info(`Dead letter job ${job.id} completed`);
});

emailDeadLetterWorker.on("error", (err) => {
	logger.error(`Dead letter worker encountered an error: ${err.message}`, { error: err });
});

emailDeadLetterWorker.on("failed", (job, err) => {
	logger.error(`Dead letter job ${job.id} failed: ${err.message}`, { jobId: job.id, error: err, jobData: job.data  });
});
