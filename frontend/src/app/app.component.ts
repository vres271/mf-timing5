import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TokensStorageService } from './core/services/tokens-storage.service';

interface IError {
  message: string[],
  error: string,
  statusCode: number
}

interface IUser {
  id: string,
  name: string,
  email: string,
  role: string[],
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [TokensStorageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'mft5-frontend';
  backendHealth = '';
  users: any[] = [];
  error: IError|null = null;

  jwt = '';
  jwt_refresh = '';
  setJwt(e: any) {
    this.jwt = e.target.value;
  }
  
  user: IUser|null = null;

  constructor(
    private tokensStorageService: TokensStorageService
  ) {}

  ngOnInit() {
    console.log('AppComponent initialized');

    this.jwt = this.tokensStorageService.getAccessToken() || '';
    this.jwt_refresh = this.tokensStorageService.getRefreshToken() || '';

    this.request('api/health')
      .then(response => response.text())
      .then(text => {
        this.backendHealth = text;
      });

    this.request('api/users')
      .then(response => response.json())
      .then(data => {
        this.users = data;
      });
    
  }

  deleteUser(user: any) {
    this.request(`api/users/${user.id}`, 'DELETE')
    .then(response => response.json())
    .then(res => {
      console.log({res})
      if (res.error) {
        this.errorHandler(res);
        return;
      }      
      this.users = this.users.filter(u => u.id !== user.id);
    });
  }

  addUser(name: string, email: string, password: string) {
    this.error = null;

    this.request('api/users', 'POST', {name, email, password})
      .then(response => response.json())
      .then(res => {
        if (res.error) {
          this.errorHandler(res);
          return;
        }
        this.users.push(res);
      })
;
  }

  request(url: string, method?: string, data?: Object) {
    return fetch(url, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${this.jwt}`
      },
      body: data ? JSON.stringify(data) : undefined
    })

  }

  errorHandler(error: IError) {
    this.error = {
      ...error,
      message: error.message instanceof Array ? error.message : [error.message]
    };
  }

  login(name: string, password: string) {
    this.error = null;
    this.request('api/auth/login', 'POST', {name, password})
      .then(response => response.json())
      .then(res => {
        if (res.error) {
          this.errorHandler(res);
          return;
        }
        this.user = res;
        this.tokensStorageService.setTokens({
          accessToken: res.access_token, 
          refreshToken: res.refresh_token
        });
        this.jwt = res.access_token;
        this.jwt_refresh = res.refresh_token;
      });
  }

  logout() {
    this.user = null;
    this.jwt = '';
    this.jwt_refresh = '';
    this.tokensStorageService.removeTokens();
  }

  refreshToken() {
    this.error = null;
    this.request('api/auth/refresh', 'POST', {refreshToken: this.jwt_refresh})
      .then(response => response.json())
      .then(res => {
        if (res.error) {
          this.errorHandler(res);
          return;
        }
        this.jwt = res.access_token;
        this.jwt_refresh = res.refresh_token;
        this.tokensStorageService.setTokens({
          accessToken: res.access_token, 
          refreshToken: res.refresh_token
        });
      });
  }

}
