import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

// Importamos la configuración de URL según el entorno
import { environment } from '../../environments/environment';
import { Usuario } from '../features/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
 export class UserService {
 private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.base);
  }

  createUser(u: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(this.base, u);
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`);
  }

}