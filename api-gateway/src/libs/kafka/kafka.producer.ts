import { CompressionTypes, Message, Producer, Transaction } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

import { kafka, registry } from './kafka.config';
import { IKafkaProducer } from './kafka.interface';

export class KafkaProducer implements IKafkaProducer {
  protected producer: Producer;
  protected registerId: number;
  public isReady = false;

  public async init(): Promise<void> {
    const producer = kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionalId: uuidv4(),
    });

    this.producer = producer;
    await this.producer.connect();
    this.isReady = true;
  }

  public async getTransaction(): Promise<Transaction> {
    const transaction = await this.producer.transaction();

    return transaction;
  }

  public async encode<T>(schema: string, message: T): Promise<Buffer> {
    try {
      const { id } = await registry.register({ type: 'AVRO', schema });
      const outgoingMessage = await registry.encode(id, message);

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
