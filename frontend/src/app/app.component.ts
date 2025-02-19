import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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

  ngOnInit() {
    console.log('AppComponent initialized');
    fetch('api/health')
      .then(response => response.text())
      .then(text => {
        this.backendHealth = text;
      });
  }

}
