import { Message, ConsumerSubscribeTopic, TopicMessages, Transaction } from 'kafkajs';

export interface IKafkaProducer {
  encode<T>(schema: string, message: T): Promise<Buffer>;
  getTransaction(): Promise<Transaction>;
  sendMessage(topic: string, messages: Message[]): Promise<void>;
}

export interface IKafkaConsumer {
  subscribe(topic: ConsumerSubscribeTopic): Promise<void>;
}
