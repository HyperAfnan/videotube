import { Worker } from "bullmq";
import { redisWorkerConnection as connection } from "../../config/redis.js";
import { sendEmail } from "./email.processor.js";
import emailDeadLetterQueue from "../../jobs/queues/email.deadletterqueue.js";

const emailWorker = new Worker(
	"emailQueue",
	async (job) => {
		console.log(`Worker started for job ${job.id}`);
		await sendEmail(job.data.to, job.data.subject, job.data.html).catch(
			(err) => {
				throw new Error(`Email sending failed: ${err.message}`);
			},
		);
	},
	{ connection },
);

emailWorker.on("completed", (job) => {
	console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", async (job, err) => {
	console.error(`Job ${job.id} failed with message: ${err.message}`);
	console.log(`Moving Job ${job.id} To Dead Letter Queue`);
	await emailDeadLetterQueue.add(
		"emailDeadLetterQueue",
		{ to: job.data.to, subject: job.data.subject, html: job.data.html },
		{ removeOnComplete: true, removeOnFail: true },
	);
});
