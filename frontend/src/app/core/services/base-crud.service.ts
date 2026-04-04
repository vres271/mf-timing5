import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

export abstract class BaseCrudService<TModel, TDTO> {
  constructor(
    protected api: ApiService,
    protected baseUrl: string
  ) {}

  getList(): Observable<TModel[]> {
    return this.api.getList<TDTO>(this.baseUrl).pipe(
      map(dtos => dtos.map(dto => this.fromDTO(dto)))
    );
  }

  get(id: string): Observable<TModel> {
    return this.api.get<TDTO>(`${this.baseUrl}/${id}`).pipe(
      map(dto => this.fromDTO(dto))
    );
  }

  create(model: TModel): Observable<TModel> {
    const dto = this.toCreateDTO(model);
    return this.api.create<TDTO>(this.baseUrl, dto).pipe(
      map(dto => this.fromDTO(dto))
    );
  }

  update(id: string, model: Partial<TModel>): Observable<TModel> {
    const dto = this.toUpdateDTO(model);
    return this.api.update<TDTO>(`${this.baseUrl}/${id}`, dto).pipe(
      map(dto => this.fromDTO(dto))
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete(`${this.baseUrl}/${id}`);
  }

  // АБСТРАКТНЫЕ — реализуют наследники
  abstract fromDTO(dto: TDTO): TModel;
  abstract toCreateDTO(model: TModel): any;
  abstract toUpdateDTO(model: Partial<TModel>): any;
}