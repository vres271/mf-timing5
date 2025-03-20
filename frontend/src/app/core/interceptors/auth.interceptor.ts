import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptorFn,
  HttpHandlerFn,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);


  const handleTokenRefresh = (): Observable<HttpEvent<any>> => {
    isRefreshing = true;
    return authService.refreshToken().pipe(
      switchMap(() => {
        isRefreshing = false;
        return next(req); // Повторяем оригинальный запрос
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.clearTokenExpiresIn();
        authService.setUnauthenticated();
        return throwError(error);
      })
    );
  };

  // Если токен истёк, инициируем его обновление
  if (authService.isTokenExpired() && !isRefreshing) {
    return handleTokenRefresh();
  }

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Если токен истёк, перенаправляем на страницу входа
        authService.clearTokenExpiresIn();
        authService.setUnauthenticated();
      }
      return throwError(error);
    })
  );
};