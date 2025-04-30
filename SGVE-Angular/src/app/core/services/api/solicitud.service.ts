import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ISolicitud } from '../../models/solicitud.model';
import { Observable } from 'rxjs';
import { ISolicitudDTO } from '../../models/isolicitud-dto';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private readonly API_URL = `${environment.apiUrl}/solicitudes`;
  private http = inject(HttpClient);

  constructor() { }

    getSolicitudes(): Observable<ISolicitud[]> {
      return this.http.get<ISolicitud[]>(this.API_URL);
    }

    getSolicitudById(idSolicitud: number): Observable<ISolicitudDTO> {
      return this.http.get<ISolicitudDTO>(`${this.API_URL}/${idSolicitud}`);
    }
    

    createSolicitud(solicitud: ISolicitudDTO): Observable<any> {
      return this.http.post<any>(this.API_URL, solicitud, {
        withCredentials: true // por si necesitas cookies/session
      });
    }
    updateSolicitud(solicitud: ISolicitudDTO): Observable<any> {
      return this.http.put(`${this.API_URL}/${solicitud.idSolicitud}`, solicitud);
    }
    
    deleteSolicitud(idSolicitud: number): Observable<any> {
      return this.http.delete<any>(`${this.API_URL}/${idSolicitud}`, {
        withCredentials: true // por si necesitas cookies/session
      });
    }

    getSolicitudesByEmail(): Observable<ISolicitud[]> {
      return this.http.get<ISolicitud[]>(this.API_URL);  // Llamada al backend
    }
    
  
}
