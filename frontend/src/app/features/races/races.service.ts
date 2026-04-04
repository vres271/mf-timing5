import { Injectable } from '@angular/core';
import { BaseCrudService } from './../../core/services/base-crud.service';
import { ApiService } from './../../core/services/api.service';
import { 
  IRace, IRaceDTO, 
  IRaceCreateDTO, IRaceUpdateDTO 
} from './models/race.interface';
import { map, Observable } from 'rxjs';

@Injectable()
export class RacesService extends BaseCrudService<IRace, IRaceDTO> {
  constructor(api: ApiService) {
    super(api, '/api/races');
  }

  fromDTO(dto: IRaceDTO): IRace {
    return {
      ...dto,
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt)
    };
  }

  toCreateDTO(race: IRace): IRaceCreateDTO {
    return {
      name: race.name,
      description: race.description,
      startsAt: race.startsAt.toISOString(),
      endsAt: race.endsAt!.toISOString()
    };
  }

  toUpdateDTO(race: Partial<IRace>): IRaceUpdateDTO {
    const dto: IRaceUpdateDTO = {};
    if (race.name !== undefined) dto.name = race.name;
    if (race.description !== undefined) dto.description = race.description;
    if (race.startsAt) dto.startsAt = race.startsAt.toISOString();
    if (race.endsAt) dto.endsAt = race.endsAt!.toISOString();
    return dto;
  }
}