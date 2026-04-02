import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { IUser, IUserDTO } from '../models/user.interface';
import { AuthApiService } from './auth-api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private user: IUser | null = null;
  private isAuth = false;

  private tokenExpiresIn: number | null = null;
  private tokenRefreshTimer: any = null;

  private readonly TOKEN_LONG_THRESHOLD = 1800;  // 30 мин
  private readonly LONG_REFRESH_BEFORE = 180;   // 3 мин до конца
  private readonly SHORT_REFRESH_BEFORE = 5;    // 5 сек до конца  

  constructor(
    private authApi: AuthApiService,
  ) {
  }

  isAuthenticated(): boolean {
    return this.isAuth;
  }

  hasRole(role: string): boolean {
    return this.getUser()?.roles.includes(role) || false;
  }

  getRoles(): string[] | undefined {
    return this.getUser()?.roles;
  }

  getUser(): IUser | null {
    return this.user;
  }

  private getUserFromResponse(response: IUserDTO | null) {
    if (response?.id) {
      this.user = {
        ...response,
      }
      this.isAuth = true;
    } else {
      this.user = null;
      this.isAuth = false;
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
    return this.authApi.checkAuth().pipe(
      tap(res => {
        this.getUserFromResponse(res.body);
        this.getTokenParamsFromResponse(res);
      }),
      catchError(err => {
        this.setUnauthenticated();
        throw err;
      })
    );
  }


  login(credentials: { name: string; password: string }) {
    return this.authApi.login(credentials).pipe(
      tap(res => {
        this.getUserFromResponse(res.body);
        this.getTokenParamsFromResponse(res);
      }),
      catchError(err => {
        this.setUnauthenticated();
        throw err;
      })
    )
  }

  refreshToken() {
    return this.authApi.refresh().pipe(
      tap((res: HttpResponse<any>) => {
        this.getTokenParamsFromResponse(res);
      })
    )
  }

  logout() {
    return this.authApi.logout().pipe(
      tap(res => {
        this.setUnauthenticated();
      }),
      catchError(err => {
        console.error('Failed to logout', err);
        throw err;
      })
    )
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
    const tokenRefreshBefore = expiresIn > this.TOKEN_LONG_THRESHOLD
      ? this.LONG_REFRESH_BEFORE
      : this.SHORT_REFRESH_BEFORE;

    const refreshTime = expiresIn - tokenRefreshBefore;
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }

    this.tokenRefreshTimer = setTimeout(() => {
      this.refreshToken().subscribe({
        next: () => { },  // Пустой next
        error: () => { }, // Пустой error
      });
    }, 1000 * refreshTime);
  }

}