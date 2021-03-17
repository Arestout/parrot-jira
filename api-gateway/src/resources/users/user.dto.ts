import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public username: string;

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

export class LoginUser {
  @IsString()
  public password: string;

  @IsEmail()
  public email: string;
}
