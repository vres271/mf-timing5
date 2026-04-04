import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserDTO } from '../models/user.interface';
import { ApiUrl } from '../../api.urls';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  constructor(private http: HttpClient) {}

  checkAuth(): Observable<HttpResponse<IUserDTO>> {
    return this.http.get<IUserDTO>(ApiUrl.AuthMe, { observe: 'response' });
  }

  login(credentials: { name: string; password: string }): Observable<HttpResponse<IUserDTO>> {
    return this.http.post<IUserDTO>(ApiUrl.AuthLogin, credentials, { observe: 'response' });
  }

  refresh(): Observable<HttpResponse<any>> {
    return this.http.post(ApiUrl.AuthRefresh, {}, { observe: 'response' });
  }

  logout(): Observable<void> {
    return this.http.post<void>(ApiUrl.AuthLogout, {});
  }
}