import { Component, signal, computed, ChangeDetectionStrategy, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, EMPTY } from 'rxjs';
import { InputTextComponent } from '../../shared/ui/components/input/input.component';
import { ButtonComponent } from '../../shared/ui/components/button/button.component';
import { TableComponent } from '../../shared/ui/components/table/table.component';
import { UsersService } from './users.service';
import { CommonModule } from '@angular/common';
import { IError } from '../../core/models/error.interface';
import { IUser } from '../../core/models/user.interface';


type UserColumn = {
  field: keyof IUser;
  header: string;
};

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [CommonModule, InputTextComponent, ButtonComponent, TableComponent],
  providers: [UsersService],
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class UsersComponent {
  // Signals состояния
  users = signal<IUser[]>([]);
  userError = signal<IError | null>(null);
  
  // Computed для таблицы
  userColumns = signal<UserColumn[]>([
    { field: 'name', header: 'Название' },
    { field: 'roles', header: 'Роли' },
  ]);

  constructor(private usersService: UsersService) {
    // Загрузка при инициализации
    this.loadUsers();
  }

  private loadUsers(): void {
    const usersSignal = toSignal(
      this.usersService.getList().pipe(
        catchError(err => {
          this.userError.set(this.handleError(err));
          return EMPTY;
        })
      ),
      { initialValue: [] }
    );
    
    // Авто-обновление при изменении
    effect(() => {
      this.users.set(usersSignal());
    });
  }

  addUser(name: string | null, desc: string | null): void {
    if (!name?.trim()) return;
    
    const user: Partial<IUser> = {
      name: name.trim(),
    };

    this.usersService.create(user as IUser).subscribe({
      next: newUser => {
        this.users.update(users => [newUser, ...users]);
        this.userError.set(null);  // Очистка ошибки
      },
      error: err => this.userError.set(this.handleError(err))
    });
  }

  deleteUser(id: string): void {
    this.usersService.delete(id).subscribe({
      next: () => {
        this.users.update(users => users.filter(user => user.id !== id));
      },
      error: err => this.userError.set(this.handleError(err))
    });
  }

  private handleError(error: any): IError {
    return {
      statusCode: error.status || 0,
      error: error.error || 'Unknown error',
      message: Array.isArray(error.error.message) ? error.error.message : [error.error.message || 'Server error']
    };
  }
}