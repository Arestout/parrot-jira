import { Message, Transaction } from 'kafkajs';

export interface IKafkaProducer {
  isReady: boolean;
  init(): Promise<void>;
  encode<T>(schema: string, message: T): Promise<Buffer>;
  getTransaction(): Promise<Transaction>;
  sendMessage(topic: string, messages: Message[]): Promise<void>;
}
