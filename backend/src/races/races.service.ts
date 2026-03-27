import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRaceDto } from './dto/create-race.dto';
import { Race } from './entities/race.entity';
import { IRace } from './interfaces/races.interface';
import { UpdateRaceDto } from './dto/update-race.dto';

@Injectable()
export class RacesService {
  constructor(
    @InjectRepository(Race)
    private racesRepository: Repository<Race>,
  ) {}

  async create(createRaceDto: CreateRaceDto): Promise<IRace> {
    const race = this.racesRepository.create({
      ...createRaceDto,
      startsAt: new Date(),
      endsAt: null, // теперь это допустимо
    });
    const saved = await this.racesRepository.save(race);
    return saved;
  }

  async findAll(): Promise<IRace[]> {
    return this.racesRepository.find();
  }

  async findOne(id: string): Promise<IRace> {
    const race = await this.racesRepository.findOneBy({ id });
    if (!race) {
      throw new NotFoundException(`Race with ID ${id} not found`);
    }
    return race;
  }

  async update(id: string, updateRaceDto: UpdateRaceDto): Promise<IRace> {
    await this.racesRepository.update(id, updateRaceDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.racesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Race with ID ${id} not found`);
    }
  }
}
