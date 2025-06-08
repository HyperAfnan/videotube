import { Worker } from "bullmq";
import { redisWorkerConnection as connection } from "../../config/redis.js";
import { sendEmail } from "./email.processor.js";
import debug from "debug";
const log = debug("worker:emailDeadLetter:log");
const error = debug("worker:emailDeadLetter:error");

const emailDeadLetterWorker = new Worker(
	"emailDeadLetterQueue",
	async (job) => {
		const { to, subject, html } = job.data || {};
		if (!to || !subject || !html) {
			throw new Error("Missing required email fields in job data");
		}
		log(`Dead letter worker started for job ${job.id}`);
		try {
			await sendEmail(to, subject, html);
		} catch (err) {
         error(`Email sending failed for job ${job.id}:`, err.message);
			throw new Error(`Email sending failed: ${err.message}`);
		}
	},
	{ 
      connection ,
      concurrency: 10,
      limiter: {
         max: 40,
         duration: 24 * 60 * 60 * 1000, 
      },
 },
);

emailDeadLetterWorker.on("completed", (job) => {
	log(`Dead letter job ${job.id} completed`);
});

emailDeadLetterWorker.on('error', err => { 
   error("Worker error: ", err)
});

emailDeadLetterWorker.on("failed", (job, err) => {
	error(`Dead letter job ${job.id} failed: ${err.message}`);
});
