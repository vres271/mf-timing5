import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IRace } from '../interfaces/races.interface';

@Entity()
export class Race implements IRace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })  
  description?: string;

  @Column({ type: 'timestamp' })
  startsAt: Date;

  @Column({ type: 'timestamp', nullable: true })  
  endsAt?: Date | null;
}
