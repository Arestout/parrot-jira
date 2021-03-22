import { Message, Transaction } from 'kafkajs';

export interface IKafkaProducer {
  getTransaction(): Promise<Transaction>;
  sendMessage(topic: string, messages: Message[]): Promise<void>;
}
