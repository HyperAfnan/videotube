import { Worker } from "bullmq";
import { redisWorkerConnection as connection } from "../../config/redis.js";
import { sendEmail } from "./email.processor.js";

const emailDeadLetterWorker = new Worker(
	"emailDeadLetterQueue",
	async (job) => {
		console.log(`Dead letter worker started for job ${job.id}`);
		await sendEmail(job.data.to, job.data.subject, job.data.html).catch(
			(err) => {
				throw new Error(`Email sending failed: ${err.message}`);
			},
		);
	},
	{ connection },
);

emailDeadLetterWorker.on("completed", (job) => {
	console.log(`Dead letter job ${job.id} completed`);
});

emailDeadLetterWorker.on("failed", (job, err) => {
	console.error(`Dead letter job ${job.id} failed: ${err.message}`);
});
