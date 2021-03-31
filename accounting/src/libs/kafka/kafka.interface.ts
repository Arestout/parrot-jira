import { Message, ConsumerSubscribeTopic } from 'kafkajs';

export interface IKafkaProducer {
  sendMessage(topic: string, messages: Message[]): Promise<void>;
}

export interface IKafkaConsumer {
  subscribe(topic: ConsumerSubscribeTopic): Promise<void>;
}
