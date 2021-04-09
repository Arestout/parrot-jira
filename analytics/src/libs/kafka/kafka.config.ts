import { Kafka, Consumer } from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { KafkaConsumer } from './kafka.consumer';
import { TASK_STATUS_TOPIC, TASK_TOPIC, USER_TOPIC } from './../../config/index';

export const registry = new SchemaRegistry({ host: 'http://schema-registry:8081' });

export const kafka = new Kafka({
  clientId: 'analytics',
  brokers: [`kafka:9092`],
});

const consumer: Consumer = kafka.consumer({ groupId: 'analytics-group' });
const kafkaConsumer = new KafkaConsumer(consumer);

export function initializeKafkaConsumer() {
  (async function () {
    await Promise.all([
      kafkaConsumer.subscribe({ topic: USER_TOPIC, fromBeginning: true }),
      kafkaConsumer.subscribe({ topic: TASK_TOPIC, fromBeginning: true }),
      kafkaConsumer.subscribe({ topic: TASK_STATUS_TOPIC, fromBeginning: true }),
    ]);
    await kafkaConsumer.receiveMessages();
  })();
}
