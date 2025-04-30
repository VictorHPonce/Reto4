// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/api/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Obtiene la instancia del servicio
  const router = inject(Router);
  
  // Usa el método en la instancia, no como un método estático
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService); // Obtiene la instancia del servicio
    const router = inject(Router);
    
    // Usa el método en la instancia
    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }
    
    const currentUser = authService.getCurrentUser();
    if (currentUser && allowedRoles.includes(currentUser.rol)) {
      return true;
    }
    
    router.navigate(['/access-denied']);
    return false;
  };
};