import { Worker } from "bullmq";
import { redisWorkerConnection as connection } from "../../config/redis.js";
import { sendEmail } from "./email.processor.js";
import emailDeadLetterQueue from "../../jobs/queues/email.deadletterqueue.js";
import debug from "debug";
const log = debug("worker:email:log");
const error = debug("worker:email:error");

const emailWorker = new Worker(
	"emailQueue",
	async (job) => {
      log(`Worker started for job ${job.id}`);

      const { to, subject, html } = job.data;
      if (!to || !subject || !html) {
         log(`Job ${job.id} missing required email fields`);
         throw new Error("Missing required email fields");
      }

      try { 
         await sendEmail(to, subject, html);
      } catch (queueError) {
         error(`Email sending failed for job ${job.id}:`, queueError);
         throw new Error("Email sending failed");
      }
   },
	{ 
      connection ,
      concurrency: 10,
      limiter: {
         max: 450,
         duration: 24 * 60 * 60 * 1000, 
      },
   },
);

emailWorker.on("completed", async (job) => {
	log(`Job ${job.id} completed`);
});

emailWorker.on('error', err => { 
   error("Worker error: ", err)
});

emailWorker.on("failed", async (job, err) => {
   error(`Job ${job.id} failed with message: ${err.message}`);
   log(`Moving Job ${job.id} To Dead Letter Queue`);

   try {
      await emailDeadLetterQueue.add(
         "emailDeadLetterQueue",
         { ...job.data },
         { removeOnComplete: true, removeOnFail: true },
      );
   } catch (queueError) {
      queueError(`Failed to move job ${job.id} to dead letter queue: ${queueError.message}`);
      throw new Error(`Failed to move job ${job.id} to dead letter queue: ${queueError.message}`);
   }
});
