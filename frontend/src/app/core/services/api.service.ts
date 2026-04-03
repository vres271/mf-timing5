import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  create<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  getList<T>(url: string): Observable<T[]> {
    return this.http.get<T[]>(url);
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  update<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body);
  }

  delete<T = void>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}