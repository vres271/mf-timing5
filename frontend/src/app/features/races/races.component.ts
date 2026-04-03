import { Component, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { InputTextComponent } from '../../shared/ui/components/input/input.component';
import { ButtonComponent } from '../../shared/ui/components/button/button.component';
import { TableComponent } from '../../shared/ui/components/table/table.component';
import { RacesService } from './races.service';
import { IRace } from './models/race.interface';
import { CommonModule } from '@angular/common';
import { IError } from '../../core/models/error.interface';


type RaceColumn = {
  field: keyof IRace;
  header: string;
};

@Component({
  selector: 'app-races',
  templateUrl: './races.component.html',
  standalone: true,
  imports: [CommonModule, InputTextComponent, ButtonComponent, TableComponent],
  providers: [RacesService],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class RacesComponent {
  // Signals состояния
  races = signal<IRace[]>([]);
  raceError = signal<IError | null>(null);
  
  // Computed для таблицы
  raceColumns = signal<RaceColumn[]>([
    { field: 'name', header: 'Название' },
    { field: 'description', header: 'Описание' },
    { field: 'startsAt', header: 'Начало' },
    { field: 'endsAt', header: 'Окончание' }
  ]);

  constructor(private racesService: RacesService) {
    // Загрузка при инициализации
    this.loadRaces();
  }

  private loadRaces(): void {
    const racesSignal = toSignal(
      this.racesService.get().pipe(
        catchError(err => {
          this.raceError.set(this.handleError(err));
          return EMPTY;
        })
      ),
      { initialValue: [] }
    );
    
    // Авто-обновление при изменении
    effect(() => {
      this.races.set(racesSignal());
    });
  }

  addRace(name: string | null, desc: string | null): void {
    if (!name?.trim()) return;
    
    const race: Partial<IRace> = {
      name: name.trim(),
      description: desc?.trim() || undefined,
      startsAt: new Date(),
      endsAt: undefined
    };

    this.racesService.create(race as IRace).subscribe({
      next: newRace => {
        this.races.update(races => [newRace, ...races]);
        this.raceError.set(null);  // Очистка ошибки
      },
      error: err => this.raceError.set(this.handleError(err))
    });
  }

  deleteRace(id: string): void {
    this.racesService.delete(id).subscribe({
      next: () => {
        this.races.update(races => races.filter(race => race.id !== id));
      },
      error: err => this.raceError.set(this.handleError(err))
    });
  }

  private handleError(error: any): IError {
    return {
      statusCode: error.status || 0,
      error: error.error || 'Unknown error',
      message: Array.isArray(error.message) ? error.message : [error.message || 'Server error']
    };
  }
}