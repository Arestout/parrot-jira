import { CompressionTypes, Message, Producer, Transaction } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

import { kafka, registry } from './kafka.config';
import { IKafkaProducer } from './kafka.interface';

export class KafkaProducer implements IKafkaProducer {
  protected producer: Producer;
  protected registerId: number;

  public constructor(schema) {
    this.init(schema);
  }

  private async init(schema): Promise<void> {
    const producer = kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionalId: uuidv4(),
    });
    this.producer = producer;

    const { id } = await registry.register(schema);
    this.registerId = id;

    await this.producer.connect();
  }

  public async getTransaction(): Promise<Transaction> {
    const transaction = await this.producer.transaction();

    return transaction;
  }

  public async encode<T>(message: T): Promise<Buffer> {
    try {
      const outgoingMessage = await registry.encode(this.registerId, message);

      return outgoingMessage;
    } catch (error) {
      throw error;
    }
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
