import { ErrorDto } from './error.interface';

export interface IErrorRepository {
  create(errorDto: ErrorDto): Promise<ErrorDto>;
}
