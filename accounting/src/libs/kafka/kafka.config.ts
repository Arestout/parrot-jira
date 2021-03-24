import { Kafka } from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

export const registry = new SchemaRegistry({ host: 'http://schema-registry:8081' });

export const kafka = new Kafka({
  clientId: 'task-tracker',
  brokers: [`kafka:9092`],
});
