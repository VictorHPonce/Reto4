import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUsuario } from '../../models/usuario.model';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly API_URL = `${environment.apiUrl}/usuarios`;
  private http = inject(HttpClient);

  constructor() { }
  getUsuario(): Observable<IUsuario[]> {
    return this.http.get<IUsuario[]>(this.API_URL);
  }

  getUsuarioById(email: String): Observable<IUsuario> {
    return this.http.get<IUsuario>(`${this.API_URL}/${email}`);
  }

  createUsuario(usuario: IUsuario): Observable<IUsuario> {
    return this.http.post<IUsuario>(this.API_URL, usuario);
  }

  updateUsuario(email: string, usuario: IUsuario): Observable<IUsuario> {
    return this.http.put<IUsuario>(`${this.API_URL}/${email}`, usuario);
  }

  deleteUsuario(idEmpresa: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${idEmpresa}`);
  }

  getEmpresaId(): Observable<{ idEmpresa: number }> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No se encontró el token en localStorage');
    }
  
    const decodedToken: any = jwtDecode(token);
    const email = decodedToken.sub;
  
    return this.http.get<{ idEmpresa: number }>(`${this.API_URL}/por-email/${email}`);
  }

  updateUsuarioEnable(email: string, enable: number) {
    return this.http.patch(`${this.API_URL}/${email}/enable`, { enabled: enable });
  }
  
}

