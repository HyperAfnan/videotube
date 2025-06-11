import { Queue } from "bullmq";
import { redisQueueConnection as connection } from "../../../config/redis.js";

const userQueue = new Queue("userQueue", { connection });

export default userQueue;
