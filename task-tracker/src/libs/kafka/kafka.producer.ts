import { CompressionTypes, Message, Producer, TopicMessages, Transaction } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

import { kafka, registry } from './kafka.config';
import { IKafkaProducer } from './kafka.interface';

export class KafkaProducer implements IKafkaProducer {
  protected producer: Producer;
  private connectionPromise: Promise<void> | null;

  constructor() {
    this.connectionPromise = null;
  }

  private async connect() {
    if (!this.connectionPromise) {
      this.connectionPromise = this.init();
    }

    return this.connectionPromise;
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
      await this.connect();
      await this.producer.send({
        topic,
        messages,
        compression: CompressionTypes.GZIP,
      });
    } catch (error) {
      throw error;
    }
  }

  public async sendBatch(messages: TopicMessages[]): Promise<void> {
    try {
      await this.connect();
      await this.producer.sendBatch({
        topicMessages: messages,
        compression: CompressionTypes.GZIP,
      });
    } catch (error) {
      throw error;
    }
  }
}
