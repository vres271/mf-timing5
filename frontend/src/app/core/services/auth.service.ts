import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { TokensStorageService } from './tokens-storage.service';

interface IUser {
  id: string,
  isAuthenticated: boolean, 
  roles: string[], 
  name: string, 
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private user: IUser = {
    id: '',
    isAuthenticated: false, 
    roles: [], 
    name: '', 
  };

  constructor(
    private jwtService: JwtService,
    private tokensStorageService: TokensStorageService
  ) {
    this.loadUserData(); // Загрузить данные пользователя при инициализации сервиса
  }

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

  getUser(): IUser {
    return this.user;
  }

  // Загрузить данные пользователя из токена (если токен есть)
  loadUserData(): void {
    const token = this.tokensStorageService.getAccessToken();
    if (token) {
      const tokenPayload = this.jwtService.decodeToken(token);
      if (tokenPayload) {
        this.user.isAuthenticated = true;
        this.user.id = tokenPayload.sub;
        this.user.roles = tokenPayload.roles;
        this.user.name = tokenPayload.username;
        return;
      }
    }
    this.user.id = '';
    this.user.isAuthenticated = false;
    this.user.roles = [];
  }

}