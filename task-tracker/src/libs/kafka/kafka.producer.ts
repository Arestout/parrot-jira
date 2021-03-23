import { CompressionTypes, Message, Producer, Transaction } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

import { kafka } from './kafka.config';
import { IKafkaProducer } from './kafka.interface';

export class KafkaProducer implements IKafkaProducer {
  protected producer: Producer;

  public constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    const producer = kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionalId: uuidv4(),
    });

    this.producer = producer;
    await this.producer.connect();
  }

  public async getTransaction(): Promise<Transaction> {
    const transaction = await this.producer.transaction();

    return transaction;
  }

  public async sendMessage(topic: string, messages: Message[]): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages,
        compression: CompressionTypes.GZIP,
      });
    } catch (error) {
      throw error;
    }
  }
}
