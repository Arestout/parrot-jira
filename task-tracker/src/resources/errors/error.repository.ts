import DB from './../../database/index';
import { IErrorRepository } from './interfaces/errorRepository.interface';
import { ErrorDto } from './interfaces/error.interface';

export class ErrorRepository implements IErrorRepository {
  public errors = DB.Errors;

  public async create(errorDto: ErrorDto): Promise<ErrorDto> {
    const error: ErrorDto = await this.errors.create(errorDto);

    return error;
  }
}
