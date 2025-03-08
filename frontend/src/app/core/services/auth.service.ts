import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { TokensStorageService } from './tokens-storage.service';
import { HttpClient } from '@angular/common/http';
import { ITokensDTO } from '../models/tokens.interface';

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
    private http: HttpClient,
    private jwtService: JwtService,
    private tokensStorageService: TokensStorageService
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
  getUserDataFromToken(): void {
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

  login(credentials: { name: string; password: string }): void {
    this.http.post<ITokensDTO>('/api/auth/login', credentials).subscribe({
      next: (response) => {
        this.tokensStorageService.setTokens({
          accessToken: response.access_token, 
          refreshToken: response.refresh_token
        });
        this.getUserDataFromToken();
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  refreshToken(): void {
    const refreshToken = this.tokensStorageService.getRefreshToken();
    if (!refreshToken) {
      return;
    }
    this.http.post<ITokensDTO>('/api/auth/refresh', { refreshToken }).subscribe({
      next: (response) => {
        this.tokensStorageService.setTokens({
          accessToken: response.access_token, 
          refreshToken: response.refresh_token
        });
        this.getUserDataFromToken();
      },
      error: (error) => {
        console.error('Refresh token failed:', error);
      },
    });
  }

  logout(): void {
    this.tokensStorageService.removeTokens();
    this.getUserDataFromToken();
  }


}