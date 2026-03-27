import { IsString, IsDateString, IsOptional } from 'class-validator';
import { IRace } from '../interfaces/races.interface';

export class CreateRaceDto implements Omit<IRace, 'id' | 'startsAt' | 'endsAt'> {
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
