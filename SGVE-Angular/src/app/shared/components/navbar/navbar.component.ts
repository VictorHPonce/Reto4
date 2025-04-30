import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/api/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}
  
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  
  get isAdmin(): boolean {
    return this.authService.hasRole('ADMON');
  }
  
  get isEmpresa(): boolean {
    return this.authService.hasRole('EMPRESA');
  }
  
  get isCliente(): boolean {
    return this.authService.hasRole('CLIENTE');
  }

  // constructor(
  //   public authService: AuthService,
  //   private router: Router
  // ) {}
  
  // ngOnInit(): void {
  //   // Puedes realizar inicializaciones aquí si es necesario
  // }
  
  /**
   * Obtiene el nombre del usuario para mostrar en el navbar
   */
  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.sub || 'Usuario';
  }
  
  // /**
  //  * Cierra la sesión del usuario
  //  */
  // logout(): void {
  //   this.authService.logout();
  //   this.router.navigate(['/login']);
  // }
}
