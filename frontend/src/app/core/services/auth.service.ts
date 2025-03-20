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
  ) {
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

  getUserFromResponse(response?: IUserDTO) {
    if (response?.id) {
      this.user = {
        ...response,
        isAuthenticated: true
      }
    } else {
      this.user.id = '';
      this.user.isAuthenticated = false;
      this.user.roles = [];
    }
  }

  checkAuth() {
    return this.http.get<IUserDTO>('/api/auth/me').subscribe({
      next: (user) => {
        this.getUserFromResponse(user);
      },
      error: (err) => {
        this.user.id = '';
        this.user.isAuthenticated = false;
        this.user.roles = [];
      },
    });
  }

  login(credentials: { name: string; password: string }): void {
    this.http.post<IUserDTO>('/api/auth/login', credentials).subscribe({
      next: (user) => {
        this.getUserFromResponse(user);
      },
      error: (error) => {
        this.getUserFromResponse();
        console.error('Login failed:', error);
      },
    });
  }

  refreshToken(): void {
    this.http.post('/api/auth/refresh', {}).subscribe({
      next: () => {
      },
      error: (error) => {
        this.user.isAuthenticated = false;
        console.error('Refresh token failed:', error);
      },
    });
  }

  logout() {
    return this.http.post('/api/auth/logout', {}).subscribe({
      next: () => {
        this.getUserFromResponse();
        console.log('Logged out successfully');
      },
      error: (err) => {
        console.error('Failed to logout', err);
      },
    });
  }

}