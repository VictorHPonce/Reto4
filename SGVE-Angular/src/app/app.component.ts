import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { environment } from '../environments/environment';
import { AuthService } from './core/services/api/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SGVE-Angular';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    console.log('API URL:', environment.apiUrl);
    this.authService.refreshUserState();
  }
}
