import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICategoria } from '../../models/categoria.model';
import { Observable} from 'rxjs';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private readonly API_URL = `${environment.apiUrl}/categorias`;
  private http = inject(HttpClient);

  constructor() { }

  getCategorias(): Observable<ICategoria[]> {
    return this.http.get<ICategoria[]>(this.API_URL);
  }

  getCategoriaById(idCategoria: number): Observable<ICategoria> {
    return this.http.get<ICategoria>(`${this.API_URL}/${idCategoria}`);
  }

  createCategoria(categoria: ICategoria): Observable<ICategoria> {
    return this.http.post<ICategoria>(this.API_URL, categoria, { 
      withCredentials: true  // Important for sending credentials
    });
  }

  updateCategoria(idCategoria: number, categoria: ICategoria): Observable<ICategoria> {
    return this.http.put<ICategoria>(`${this.API_URL}/${idCategoria}`, categoria);
  }

  deleteCategoria(idCategoria: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${idCategoria}`);
  }
}
