import { IsBoolean, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  public description: string;

  @IsBoolean()
  public completed: boolean;
}
