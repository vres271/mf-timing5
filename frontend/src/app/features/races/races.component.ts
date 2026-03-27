import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InputTextComponent } from '../../shared/ui/components/input/input.component';
import { ButtonComponent } from '../../shared/ui/components/button/button.component';
import { TableComponent } from '../../shared/ui/components/table/table.component';
import { TokensStorageService } from '../../core/services/tokens-storage.service';

interface IError {
  message: string[];
  error: string;
  statusCode: number;
}

interface IRace {
  id: string;
  name: string;
  description?: string;
  startsAt: Date;
  endsAt?: Date;
}

type RaceColumn = {
  field: keyof IRace;
  header: string;
};

@Component({
  selector: 'app-races',
  standalone: true,
  imports: [InputTextComponent, ButtonComponent, TableComponent],
  providers: [TokensStorageService],
  templateUrl: './races.component.html',
})
export class RacesComponent {
  races: IRace[] = [];
  raceError: IError | null = null;

  jwt = '';

  raceColumns: RaceColumn[] = [
    { field: 'name', header: 'Название' },
    { field: 'description', header: 'Описание' },
    { field: 'startsAt', header: 'Начало' },
    { field: 'endsAt', header: 'Окончание' },
  ];

  constructor(
    private tokensStorageService: TokensStorageService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.jwt = this.tokensStorageService.getAccessToken() || '';
    this.request('api/races')
      .then(res => {
        this.races = res as IRace[];
      });
  }

  request(url: string, method?: string, data?: Object) {
    return this.http
      .request(method || 'GET', url, {
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .toPromise();
  }

  addRace(name: string, description: string | null) {
    this.raceError = null;
    this.request('api/races', 'POST', { name, description })
      .then((res: any) => {
        if (res.error) {
          this.handleError(res);
          return;
        }
        this.races = [...this.races, res];
      })
      .catch(error => {
        this.handleError(error.error);
      });
  }

  deleteRace(id: string) {
    this.request(`api/races/${id}`, 'DELETE')
      .then((res: any) => {
        if (res.error) {
          this.handleError(res);
          return;
        }
        this.races = this.races.filter(r => r.id !== id);
      })
      .catch(error => {
        this.handleError(error.error);
      });
  }

  handleError(error: IError) {
    this.raceError = {
      ...error,
      message: Array.isArray(error.message) ? error.message : [error.message],
    };
  }
}
