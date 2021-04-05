import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public fullName: string;

  @IsString()
  public role: string;

  @IsString()
  public public_id: string;
}
