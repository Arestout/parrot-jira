import { Kafka } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

export const kafka = new Kafka({
  clientId: 'api-gateway',
  brokers: [`kafka:9092`],
});

const initProducer = async () => {
  const producer = kafka.producer({
    maxInFlightRequests: 1,
    idempotent: true,
    transactionalId: uuidv4(),
  });

  await producer.connect();

  return producer;
};
