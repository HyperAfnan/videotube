import env from "./env.js";
import amqp from "amqplib";
import { logger } from "../utils/logger/index.js";
const rabbitMQConnectionLogger = logger.child({ module: "RabbitMQ Connection" });

const { rabbitMQURL } = env;
rabbitMQConnectionLogger.info(`Connecting to RabbitMQ at: ${rabbitMQURL}`);
let connection, channel;

export const ConnectToRabbitMQ = async (retry = 10, delay = 5000) => {
  while (retry) {
    try {
      connection = await amqp.connect(rabbitMQURL);
      channel = await connection.createChannel();

      await channel.assertQueue("email_queue", { durable: true , persistent: true});

      rabbitMQConnectionLogger.info("Connected to RabbitMQ");
      return { connection, channel };
    } catch (error) {
      rabbitMQConnectionLogger.error( `RabbitMQ connection failed. Retrying in ${delay / 1000} seconds...`, error);
      retry--;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Could not connect to RabbitMQ");
};

export const getChannel = () => channel;
export const getConnection = () => connection;
