import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

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

  private tokenExpiresIn: number | null = null;
  private tokenRefreshTimer: any = null;

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

  private getUserFromResponse(response: IUserDTO | null) {
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

  private getTokenParamsFromResponse(response: HttpResponse<IUserDTO>) {
    const expiresIn = +(response.headers.get('X-Token-Expires-In') || 0);
    if (expiresIn) {
      this.setTokenExpiresIn(expiresIn);
    }
  }

  setUnauthenticated() {
    this.getUserFromResponse(null);
    this.clearTokenExpiresIn();
  }

  checkAuth() {
    return this.http.get<IUserDTO>('/api/auth/me', {observe: 'response'}).subscribe({
      next: (res: HttpResponse<IUserDTO>) => {
        this.getUserFromResponse(res.body);
        this.getTokenParamsFromResponse(res);
      },
      error: (err) => {
        this.setUnauthenticated()
      },
    });
  }

  login(credentials: { name: string; password: string }): void {
    this.http.post<IUserDTO>('/api/auth/login', credentials, {observe: 'response'}).subscribe({
      next: (res: HttpResponse<IUserDTO>) => {
        this.getUserFromResponse(res.body);
        this.getTokenParamsFromResponse(res);
      },
      error: (error) => {
        this.setUnauthenticated();
      },
    });
  }

  refreshToken() {
    return this.http.post('/api/auth/refresh', {}, {observe: 'response'}).pipe(
      tap((res: HttpResponse<any>) => {
        this.getTokenParamsFromResponse(res);
      })
    )
  }

  logout() {
    return this.http.post('/api/auth/logout', {}).subscribe({
      next: () => {
        this.setUnauthenticated();
      },
      error: (err) => {
        console.error('Failed to logout', err);
      },
    });
  }

  setTokenExpiresIn(expiresIn: number) {
    this.tokenExpiresIn = Date.now() + expiresIn * 1000; // Сохраняем время истечения токена
    this.startTokenRefreshTimer(expiresIn);
  }

  isTokenExpired(): boolean {
    if (!this.tokenExpiresIn) return false;
    return Date.now() >= this.tokenExpiresIn;
  }

  clearTokenExpiresIn() {
    this.tokenExpiresIn = null;
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }
  }

  private startTokenRefreshTimer(expiresIn: number) {
    const tokenRefreshBefore = expiresIn > 1800 ? 180 : 5;
    const refreshTime = expiresIn - tokenRefreshBefore;
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }

    this.tokenRefreshTimer = setTimeout(() => {
      this.refreshToken().subscribe({
        next: (response) => {
        },
        error: (err) => {
        },
      });
    }, 1000 * refreshTime);
  }

}