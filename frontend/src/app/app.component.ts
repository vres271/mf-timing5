import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TokensStorageService } from './core/services/tokens-storage.service';
import { AuthService } from './core/services/auth.service';


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

  imports: [RouterOutlet, RouterLink],
  providers: [TokensStorageService ],
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
    private tokensStorageService: TokensStorageService,
    public authService: AuthService,
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
    
  }


  request(url: string, method?: string, data?: Object) {
    return fetch(url, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        // "Authorization": `Bearer ${this.jwt}`
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
    this.authService.login({name, password});
    // this.error = null;
    // this.request('api/auth/login', 'POST', {name, password})
    //   .then(response => response.json())
    //   .then(res => {
    //     if (res.error) {
    //       this.errorHandler(res);
    //       this.authService.getUserDataFromToken();
    //       return;
    //     }
    //     this.user = res;
    //     this.tokensStorageService.setTokens({
    //       accessToken: res.access_token, 
    //       refreshToken: res.refresh_token
    //     });
    //     this.jwt = res.access_token;
    //     this.jwt_refresh = res.refresh_token;
    //     this.authService.getUserDataFromToken();
    //   });
  }

  logout() {
    this.authService.logout();
    // this.user = null;
    // this.jwt = '';
    // this.jwt_refresh = '';
    // this.tokensStorageService.removeTokens();
    // this.authService.getUserDataFromToken();
  }

  refreshToken() {
    this.authService.refreshToken().subscribe();
    // this.error = null;
    // this.request('api/auth/refresh', 'POST', {refreshToken: this.jwt_refresh})
    //   .then(response => response.json())
    //   .then(res => {
    //     if (res.error) {
    //       this.errorHandler(res);
    //       this.authService.getUserDataFromToken();
    //       return;
    //     }
    //     this.jwt = res.access_token;
    //     this.jwt_refresh = res.refresh_token;
    //     this.tokensStorageService.setTokens({
    //       accessToken: res.access_token, 
    //       refreshToken: res.refresh_token
    //     });
    //     this.authService.getUserDataFromToken();
    //   });
  }

}
