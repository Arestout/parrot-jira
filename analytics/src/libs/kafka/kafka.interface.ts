import { ConsumerSubscribeTopic } from 'kafkajs';

export interface IKafkaConsumer {
  subscribe(topic: ConsumerSubscribeTopic): Promise<void>;
}
