import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserDTO } from '../models/user.interface';

enum ApiURL {
  Me = '/api/auth/me',
  Login = '/api/auth/login',
  Refresh = '/api/auth/refresh',
  Logout = '/api/auth/logout'
}

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  constructor(private http: HttpClient) {}

  checkAuth(): Observable<HttpResponse<IUserDTO>> {
    return this.http.get<IUserDTO>(ApiURL.Me, { observe: 'response' });
  }

  login(credentials: { name: string; password: string }): Observable<HttpResponse<IUserDTO>> {
    return this.http.post<IUserDTO>(ApiURL.Login, credentials, { observe: 'response' });
  }

  refresh(): Observable<HttpResponse<any>> {
    return this.http.post(ApiURL.Refresh, {}, { observe: 'response' });
  }

  logout(): Observable<void> {
    return this.http.post<void>(ApiURL.Logout, {});
  }
}