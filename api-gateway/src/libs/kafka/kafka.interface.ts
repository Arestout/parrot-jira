import { Message, Transaction } from 'kafkajs';

export interface IKafkaProducer {
  encode<T>(schema: string, message: T): Promise<Buffer>;
  getTransaction(): Promise<Transaction>;
  sendMessage(topic: string, messages: Message[]): Promise<void>;
}

export interface IHeader {
  event_id: string;
  event_version: '1';
  event_name: 'UserCreated' | 'UserUpdated' | 'UserDeleted';
  event_time: string;
  producer: string;
}
