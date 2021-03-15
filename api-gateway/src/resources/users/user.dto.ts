import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public fullName: string;

  @IsString()
  public role: string;

  @IsString()
  public slack: string;

  @IsString()
  public mobile: string;
}
