import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../entities/user.entity';

export class UserDto {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}