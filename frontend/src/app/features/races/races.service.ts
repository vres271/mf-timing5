import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { 
  IRace, IRaceDTO, 
  IRaceCreateDTO, IRaceUpdateDTO 
} from './models/race.interface';
import { ApiService } from '../../core/services/api.service';

@Injectable()
export class RacesService {
  private readonly baseUrl = '/api/races';

  constructor(private api: ApiService) {}

  get(): Observable<IRace[]> {
    return this.api.getList<IRaceDTO>(this.baseUrl).pipe(
      map(dtOs => dtOs.map(dto => this.fromDTO(dto)))
    );
  }

  getById(id: string): Observable<IRace> {
    return this.api.get<IRaceDTO>(`${this.baseUrl}/${id}`).pipe(
      map(dto => this.fromDTO(dto))
    );
  }

  create(race: IRace): Observable<IRace> {
    const dto = this.toCreateDTO(race);
    return this.api.create<IRaceDTO>(this.baseUrl, dto).pipe(
      map(dto => this.fromDTO(dto))
    );
  }

  update(id: string, race: Partial<IRace>): Observable<IRace> {
    const dto = this.toUpdateDTO(race);
    return this.api.update<IRaceDTO>(`${this.baseUrl}/${id}`, dto).pipe(
      map(dto => this.fromDTO(dto))
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete(`${this.baseUrl}/${id}`);
  }

  private fromDTO(dto: IRaceDTO): IRace {
    return {
      ...dto,
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt)
    };
  }

  private toCreateDTO(race: IRace): IRaceCreateDTO {
    return {
      name: race.name,
      description: race.description,
      startsAt: race.startsAt.toISOString(),
      endsAt: race.endsAt.toISOString()
    };
  }

  private toUpdateDTO(race: Partial<IRace>): IRaceUpdateDTO {
    const dto: IRaceUpdateDTO = {};
    if (race.name !== undefined) dto.name = race.name;
    if (race.description !== undefined) dto.description = race.description;
    if (race.startsAt) dto.startsAt = race.startsAt.toISOString();
    if (race.endsAt) dto.endsAt = race.endsAt.toISOString();
    return dto;
  }
}