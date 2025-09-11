import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

// Importamos la configuración de URL según el entorno
import { environment } from '../../environments/environment';
import { Usuario } from '../features/models/usuario.model';

export interface GetUsersParams {
  search?: string;   // texto de búsqueda
  page?: number;     // página
  limit?: number;    // tamaño de página
}

@Injectable({
  providedIn: 'root'
})
 export class UserService {
 private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

   getUsers(params: GetUsersParams = {}): Observable<Usuario[]> {
    const httpParams = new HttpParams({
      fromObject: {
        ...(params.search ? { search: params.search } : {}),
        ...(params.page   ? { page: String(params.page) } : {}),
        ...(params.limit  ? { limit: String(params.limit) } : {})
      }
    });
        return this.http.get<Usuario[]>(this.base, { params: httpParams });
  }

  createUser(u: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(this.base, u);
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

   search(q: string): Observable<Usuario[]> {
    const query = q?.trim();
    if (!query) return of([]);
    const params = new HttpParams().set('q', query);
    // Ejemplo: GET /api/users/search?q=texto   (ajusta si usas ?q= en /users)
    return this.http.get<Usuario[]>(`${this.base}/search`, { params });
  }

}