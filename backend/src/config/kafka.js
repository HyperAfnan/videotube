import { Kafka } from "kafkajs";
import ENV from "./env.js";

export const kafka = new Kafka({
  clientId: ENV.KAFKA_CLIENT_ID,
  brokers: ENV.KAFKA_BROKERS,
});

