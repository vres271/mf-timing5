import { IsString, IsEmail, MinLength } from 'class-validator';
import { IUser } from '../interfaces/user.interface';

export class CreateUserDto implements Omit<IUser, 'id' | 'roles'> {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}