import { Consumer, Kafka } from 'kafkajs';
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import { KafkaConsumer } from './kafka.consumer';
import { USER_TOPIC } from '../../config';

export const registry = new SchemaRegistry({ host: 'http://schema-registry:8081' });

export const kafka = new Kafka({
  clientId: 'task-tracker',
  brokers: [`kafka:9092`],
});

const consumer: Consumer = kafka.consumer({ groupId: 'task-tracker-group' });
const kafkaConsumer = new KafkaConsumer(consumer);

export function initializeKafkaConsumer() {
  (async function () {
    await kafkaConsumer.subscribe({ topic: USER_TOPIC, fromBeginning: true });
    await kafkaConsumer.receiveMessages();
  })();
}
