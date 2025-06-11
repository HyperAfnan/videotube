import { Queue } from "bullmq";
import { redisQueueConnection as connection } from "../../../config/redis.js";

const emailDeadLetterQueue = new Queue("emailDeadLetterQueue", { connection });

export default emailDeadLetterQueue;
