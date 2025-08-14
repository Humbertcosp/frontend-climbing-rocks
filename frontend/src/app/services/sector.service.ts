
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Sector } from '../features/models/sector.model';
import { environment } from '../../environments/environment';


// src/app/core/services/sectores.service.ts
@Injectable({ providedIn: 'root' })
export class SectoresService {

  private URL = 'assets/sectores.json';

  private base = `${environment.apiUrl}/sectores`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sector[]> {
    return this.http.get<Sector[]>(this.base);
  }

  getById(id: string): Observable<Sector> {
    return this.http.get<Sector>(`${this.base}/${id}`);
  }

  /** listado completo */
  list(): Observable<Sector[]> {
    return this.http.get<Sector[]>(this.URL);
  }

  /** página + tamaño (útil para infinitescroll) */
  getPaginated(page: number, size: number): Observable<Sector[]> {
    return this.list()
      .pipe(map(arr => arr.slice(page * size, (page + 1) * size)));
  }

  }

