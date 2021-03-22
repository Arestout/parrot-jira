import { CompressionTypes, Message, Producer } from 'kafkajs';
import { IKafkaProducer } from './kafka.interface';

export class KafkaProducer implements IKafkaProducer {
  protected producer: Producer;

  public constructor(producer: Producer) {
    this.producer = producer;
  }

  public async sendMessage(topic: string, messages: Message[]): Promise<void> {
    try {
      await this.producer.connect();
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
