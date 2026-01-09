import amqp from "amqplib";
import env from "./env.js";
import { logger } from "../utils/logger/index.js";

const rabbitMQConnectionLogger = logger.child({ service: "rabbitMQConnection" });

let connection = null;
let channel = null;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(env.rabbitMQURL);
    channel = await connection.createChannel();
    
    await channel.assertQueue("email_queue", { durable: true });
    
    rabbitMQConnectionLogger.info("Email Service connected to RabbitMQ");
    
    connection.on('error', (err) => {
      rabbitMQConnectionLogger.error("RabbitMQ connection error:", err);
    });
    
    connection.on('close', () => {
      rabbitMQConnectionLogger.warn("RabbitMQ connection closed");
    });
    
    return { connection, channel };
  } catch (error) {
    rabbitMQConnectionLogger.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
};

export const getChannel = () => channel;
export const getConnection = () => connection;

export const closeRabbitMQ = async () => {
  try {
    await channel?.close();
    await connection?.close();
    rabbitMQConnectionLogger.info("RabbitMQ connection closed");
  } catch (error) {
    rabbitMQConnectionLogger.error("Error closing RabbitMQ:", error);
  }
};

