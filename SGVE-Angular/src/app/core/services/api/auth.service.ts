import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environments/environment';



interface AuthResponse {
  token: string;
  type: string;
}

interface DecodedToken {
  sub: string;
  rol: string;
  exp: number;
  idEmpresa?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<DecodedToken | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  private loadToken() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);

        // Verificar que el token tenga la información necesaria
        if (!decodedToken.sub || !decodedToken.rol) {
          console.warn('Token inválido: falta información del usuario');
          this.logout();
          return;
        }

        // Verificar si el token ha expirado
        if (decodedToken.exp * 1000 > Date.now()) {
          console.log('Token válido para:', decodedToken.sub, 'con rol:', decodedToken.rol);
          this.currentUserSubject.next(decodedToken);
        } else {
          // Token expirado
          console.warn('Token expirado');
          this.logout();
        }
      } catch (error) {
        console.error('Error al decodificar token:', error);
        this.logout();
      }
    }
  }

  hasRole(role: string): boolean {
    const userRole = this.currentUserSubject.value?.rol;

    // Log para depuración
    console.log('Verificando rol:', role, 'Usuario tiene rol:', userRole);

    if (!userRole) return false;

    // Considerar casos donde el rol pueda tener un prefijo como "ROLE_"
    return userRole === role ||
      userRole === `ROLE_${role}` ||
      userRole.includes(role);
  }

  // Agregar al servicio
  refreshUserState() {
    this.loadToken();
    return this.isLoggedIn();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('auth_token', response.token);
          const decodedToken = jwtDecode<DecodedToken>(response.token);
          this.currentUserSubject.next(decodedToken);
        })
      );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): DecodedToken | null {
    return this.currentUserSubject.value;
  }

  // hasRole(role: string): boolean {
  //   return this.currentUserSubject.value?.rol === role;
  // }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Nuevo método para obtener el ID de la empresa del usuario actual
  getCurrentEmpresaId(): number | null {
    const user = this.currentUserSubject.value;
    return user?.idEmpresa || null;
  }

  // Nuevo método para verificar si el usuario tiene rol de empresa
  isEmpresa(): boolean {
    return this.hasRole('EMPRESA');
  }

  getCurrentEmail(): string | null {
    return this.currentUserSubject.value?.sub || null;
  }


}