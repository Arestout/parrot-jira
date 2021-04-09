import { IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  public id: string;
}
