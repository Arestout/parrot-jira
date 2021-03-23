import { Kafka } from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

export const registry = new SchemaRegistry({ host: 'http://localhost:8081' });

export const kafka = new Kafka({
  clientId: 'api-gateway',
  brokers: [`kafka:9092`],
});
