import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface IError {
  message: string[],
  error: string,
  statusCode: number
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
  
  ngOnInit() {
    console.log('AppComponent initialized');
    fetch('api/health')
      .then(response => response.text())
      .then(text => {
        this.backendHealth = text;
      });

    fetch('api/users')
      .then(response => response.json())
      .then(data => {
        this.users = data;
      });
    
  }

  deleteUser(user: any) {
    fetch(`api/users/${user.id}`, {method: 'DELETE'})
    .then(() => {
      this.users = this.users.filter(u => u.id !== user.id);
    });
  }

  addUser(name: string, email: string, password: string) {
    this.error = null;
    fetch('api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name, email, password})
    })
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

  errorHandler(error: IError) {
    this.error = {
      ...error,
      message: error.message instanceof Array ? error.message : [error.message]
    };
  }

}
