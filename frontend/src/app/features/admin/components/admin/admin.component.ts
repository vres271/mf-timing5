import { Component } from '@angular/core';
import { TokensStorageService } from '../../../../core/services/tokens-storage.service';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-admin',
  standalone: true,
  imports: [],
  providers: [TokensStorageService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
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
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.jwt = this.tokensStorageService.getAccessToken() || '';
    this.jwt_refresh = this.tokensStorageService.getRefreshToken() || '';

    this.request('api/users')
      .then((res: any) => {
      this.users = res;
      });
    
  }

  deleteUser(user: any) {
    this.request(`api/users/${user.id}`, 'DELETE')
    .then((res: any) => {
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
      .then((res: any) => {
        if (res.error) {
          this.errorHandler(res);
          return;
        }
        this.users.push(res);
      })
;
  }

  request(url: string, method?: string, data?: Object) {
    return this.http.request(method || 'GET', url, {
      body: data,
      headers: {
        'Content-Type': 'application/json',
      }}).toPromise();

  }

  errorHandler(error: IError) {
    this.error = {
      ...error,
      message: error.message instanceof Array ? error.message : [error.message]
    };
  }


}
