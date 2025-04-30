// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/api/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // const authService = inject(AuthService); // Obtiene la instancia del servicio
  // const router = inject(Router);
  
  // // Usa el método en la instancia, no como un método estático
  // const token = authService.getToken();
  
  // if (token) {
  //   const authReq = req.clone({
  //     setHeaders: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
    
  //   return next(authReq).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       if (error.status === 401) {
  //         authService.logout();
  //         router.navigate(['/login']);
  //       }
  //       return throwError(() => error);
  //     })
  //   );
  // }
  
  // return next(req);


  const authService = inject(AuthService);
    const router = inject(Router);
  
    const token = authService.getToken();
  
    // Rutas públicas a las que NO se debe enviar el token
    const skipAuthUrls = [
      { method: 'POST', url: '/api/usuarios' },
      { method: 'POST', url: '/api/auth/login' },
      { method: 'POST', url: '/api/auth/register' }
    ];
  
    // Método mejorado para detectar URLs que deben omitirse
    const shouldSkip = skipAuthUrls.some(rule => {
      // Obtener la ruta completa
      const path = new URL(req.url).pathname;
      
      // Comprobar si el método coincide y si la ruta contiene la URL a omitir
      return req.method === rule.method && path.includes(rule.url);
    });

    console.log(`URL: ${req.url}, Method: ${req.method}, Should skip: ${shouldSkip}`);
  
    if (!shouldSkip && token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            authService.logout();
            router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }
  
    // Si la URL está en la lista de exclusión o no hay token
    return next(req);
  };
  
