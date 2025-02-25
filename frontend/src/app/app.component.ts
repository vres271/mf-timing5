import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface IError {
  message: string[],
  error: string,
  statusCode: number
}

interface IUser {
  id: number,
  name: string,
  email: string,
  role: string[],
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'mft5-frontend';
  backendHealth = '';
  users: any[] = [];
  error: IError|null = null;

  jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZXMiOlsiYWRtaW4iXSwiaWF0IjoxNzEwNDI3MzkxLCJleHAiOjE3NDA3MzA5OTh9.jYr9JNon4Zr0zTZIBcOCl23YZSchXBVO5qt0uO7w3dY'
  setJwt(e: any) {
    this.jwt = e.target.value;
  }
  
  user: IUser|null = null;

  ngOnInit() {
    console.log('AppComponent initialized');
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
    .then(() => {
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
      });
  }

  logout() {
    this.user = null;
  }

}
