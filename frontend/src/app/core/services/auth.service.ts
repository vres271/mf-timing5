import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = {
    isAuthenticated: true, // Пример: пользователь авторизован
    roles: ['admin', 'user'], // Роли пользователя
  };

  // Проверка авторизации
  isAuthenticated(): boolean {
    return this.user.isAuthenticated;
  }

  // Проверка ролей
  hasRole(role: string): boolean {
    return this.user.roles.includes(role);
  }

  // Получение ролей
  getRoles(): string[] {
    return this.user.roles;
  }
}