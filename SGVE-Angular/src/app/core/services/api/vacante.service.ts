import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IVacante } from '../../models/vacante.model';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VacanteService {

  private apiUrl = `${environment.apiUrl}/vacantes`;
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  constructor() { }

  // Obtener todas las vacantes
  getVacantes(): Observable<IVacante[]> {
    return this.http.get<IVacante[]>(this.apiUrl);
  }

  // Obtener una vacante por ID
  getVacanteById(id: number): Observable<IVacante> {
    return this.http.get<IVacante>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva vacante
  createVacante(vacante: IVacante): Observable<IVacante> {
    return this.http.post<IVacante>(`${this.apiUrl}`, vacante);
  }

// Método mejorado que maneja tanto objetos completos como datos de formulario
private convertToVacanteDTO(vacante: any): any {
  // Para manejar tanto datos de formulario como objetos completos
  return {
    idEmpresa: vacante.idEmpresa || (vacante.empresa?.idEmpresa),
    idCategoria: vacante.idCategoria || (vacante.categoria?.idCategoria),
    nombre: vacante.nombre,
    descripcion: vacante.descripcion,
    salario: vacante.salario,
    estatus: vacante.estado || vacante.estatus || 'ACTIVA',
    destacado: vacante.destacado,
    imagen: vacante.imagen,
    detalles: vacante.detalles,
    fecha: vacante.fecha
  };
}

// Método para actualizar una vacante existente
updateVacante(idVacante: number, vacante: any): Observable<any> {
  const vacanteDTO = this.convertToVacanteDTO(vacante);
  console.log('Enviando datos al servidor:', vacanteDTO); // Log para depuración
  return this.http.put<any>(`${this.apiUrl}/${idVacante}`, vacanteDTO);
}

  // Obtener vacantes del usuario autenticado
  getMisVacantes(): Observable<IVacante[]> {
    return this.http.get<IVacante[]>(`${this.apiUrl}/mis-vacantes`);
  }

  // Cancelar una vacante por su ID
  cancelarVacante(idVacante: number): Observable<IVacante> {
    console.log("ID recibido para cancelar:", idVacante);
    return this.http.put<IVacante>(`${this.apiUrl}/${idVacante}/cancelar`, {});
  }

  // Mantener el método deleteVacante como un alias de cancelarVacante para compatibilidad
  deleteVacante(idVacante: number): Observable<IVacante> {
    return this.cancelarVacante(idVacante);
  }
  
}
