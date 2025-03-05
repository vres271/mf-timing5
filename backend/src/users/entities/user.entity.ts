import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IUser } from '../interfaces/user.interface';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'simple-array', default: UserRole.USER })
  roles: UserRole[];

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  refreshToken: string;
}

// пароль 000000
// $2b$04$BrbxW7/iLnSOJt9cvBYhj.a5zIHnTWqtL3mkUAHLINXx9S/qbX3PC