import { Worker } from "bullmq";
import { redisWorkerConnection as connection } from "../config/redis.js";
import { sendRegistrationEmail } from "../components/user/emails/sendWelcome.email.js";

const emailWorker = new Worker(
  "emailQueue",
  async job => { 
      console.log(`Worker started for job ${job.id}`)
      console.log(`Processing job ${job.id} with data:`, job.data)
      const { username, to, text } = job.data;
      await sendRegistrationEmail(username, to, text);

   },
  { connection }
);

emailWorker.on("completed", job => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});
