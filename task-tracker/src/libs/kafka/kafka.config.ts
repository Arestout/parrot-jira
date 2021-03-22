import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'task-tracker',
  brokers: [`kafka:9092`],
});
