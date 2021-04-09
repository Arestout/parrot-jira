import { Message } from 'kafkajs';
import { ErrorDto } from './error.interface';

export interface IErrorService {
  create(eventMessage: Message): Promise<ErrorDto>;
}
