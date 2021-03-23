import { Message, Transaction } from 'kafkajs';

export interface IKafkaProducer {
  encode<T>(message: T): Promise<Buffer>;
  getTransaction(): Promise<Transaction>;
  sendMessage(topic: string, messages: Message[]): Promise<void>;
}
