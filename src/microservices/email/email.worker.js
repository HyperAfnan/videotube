import { Worker } from "bullmq";
import { redisWorkerConnection as connection } from "../../config/redis.js";
import { sendEmail } from "./email.processor.js";
import emailDeadLetterQueue from "../../jobs/queues/email/email.deadletter.js";
import { logger } from "../../utils/logger/index.js";
const emailWorkerLogger = logger.child({ module: "email.worker" });

const emailWorker = new Worker(
	"emailQueue",
	async (job) => {
		emailWorkerLogger.info(`Worker started for job ${job.id}`);

		const { to, subject, html } = job.data;
		if (!to || !subject || !html) {
			throw new Error("Missing required email fields");
		}

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
			max: 450,
			duration: 24 * 60 * 60 * 1000,
		},
	},
);

emailWorker.on("completed", async (job) => {
	emailWorkerLogger.info(`Email job ${job.id} completed`);
});

emailWorker.on("error", (err) => {
	emailWorkerLogger.error(`Email worker encountered an error: ${err.message}`, {
		error: err,
	});
});

emailWorker.on("failed", async (job, err) => {
	emailWorkerLogger.error(`Job ${job.id} failed with message: ${err.message}`, {
		jobId: job.id,
		error: err,
		jobData: job.data,
	});
	emailWorkerLogger.info(`Moving Job ${job.id} To Dead Letter Queue`);

	try {
		await emailDeadLetterQueue.add(
			"emailDeadLetterQueue",
			{ ...job.data },
			{ removeOnComplete: true, removeOnFail: true },
		);
	} catch (err) {
		err.jobId = job.id;
		err.jobData = job.data;
		throw err;
	}
});
