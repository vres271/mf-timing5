import { IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  readonly name: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}