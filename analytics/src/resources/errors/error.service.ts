import { IErrorRepository } from './interfaces/errorRepository.interface';
import { ErrorDto } from './interfaces/error.interface';
import { Message } from 'kafkajs';

export class ErrorService {
  public errorRepository: IErrorRepository;

  constructor(errorRepository: IErrorRepository) {
    this.errorRepository = errorRepository;
  }

  public async create(eventMessage: Message): Promise<ErrorDto> {
    const headers = {};

    for (const [key, value] of Object.entries(eventMessage.headers)) {
      headers[key] = value.toString();
    }

    const error: ErrorDto = await this.errorRepository.create({ ...headers, message: JSON.stringify(eventMessage.value) });

    return error;
  }
}
