import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEmpresa } from '../../models/empresa.model';
import { IEmpresaDTO } from '../../models/iempresa-dto';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private readonly API_URL = `${environment.apiUrl}/empresas`;
  private http = inject(HttpClient);

  constructor() { }

  getEmpresas(): Observable<IEmpresa[]> {
    return this.http.get<IEmpresa[]>(this.API_URL);
  }

  getEmpresaById(idEmpresa: number): Observable<IEmpresa> {
    return this.http.get<IEmpresa>(`${this.API_URL}/${idEmpresa}`);
  }

  createEmpresa(dto: IEmpresaDTO): Observable<IEmpresaDTO> {
    return this.http.post<IEmpresaDTO>(this.API_URL, dto);
  }
  
  updateEmpresa(idEmpresa: number, dto: IEmpresaDTO): Observable<IEmpresaDTO> {
    return this.http.put<IEmpresaDTO>(`${this.API_URL}/${idEmpresa}`, dto);
  }

  deleteEmpresa(idEmpresa: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${idEmpresa}`);
  }

}

