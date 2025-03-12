import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { HttpClient } from '@angular/common/http';
import { ITokensDTO } from '../models/tokens.interface';

interface IUser {
  id: string,
  isAuthenticated: boolean, 
  roles: string[], 
  name: string, 
}

interface IUserDTO {
  id: string,
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
    private http: HttpClient,
    private jwtService: JwtService
  ) {
    this.getUserDataFromToken(); // Загрузить данные пользователя при инициализации сервиса
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
  getUserDataFromToken(token?: string): void {
    // const token = this.tokensStorageService.getAccessToken();
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

  checkAuth() {
    return this.http.get<IUserDTO>('/api/auth/me').subscribe({
      next: (user) => {
        this.user = {
          ...user,
          isAuthenticated: true
        }
        console.log(this.user);
      },
      error: (err) => {
        this.user.isAuthenticated = false;
      },
    });
  }

  login(credentials: { name: string; password: string }): void {
    this.http.post<ITokensDTO>('/api/auth/login', credentials).subscribe({
      next: (response) => {
        this.getUserDataFromToken(response.access_token);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  refreshToken(): void {
    this.http.post<ITokensDTO>('/api/auth/refresh', {}).subscribe({
      next: (response) => {
        this.getUserDataFromToken(response.access_token);
      },
      error: (error) => {
        console.error('Refresh token failed:', error);
      },
    });
  }

  logout(): void {
    this.getUserDataFromToken();
  }

}