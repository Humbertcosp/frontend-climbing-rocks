import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Quedada } from '../features/models/quedada.model';

type ApiAsistente = { id: string; nombre: string; email?: string; avatarUrl?: string; grado?: number };
type ApiQuedada = {
  _id: string;
  sectorId: string;
  sectorNombre: string;
  titulo: string;
  fecha: string;          // ISO en backend
  hora?: string;
  descripcion?: string;
  grado?: number;
  creador: string;
  asistentes: ApiAsistente[];
  notas?: string;
  maxAsistentes?: number;
  sectorCoords?: { lat: number; lon: number };
  vehiculo?: number;
  mascotas?: number;
  imageUrl?: string;
};

@Injectable({ providedIn: 'root' })
export class QuedadasService {
  private base = `${environment.apiUrl}/quedadas`;
  private _quedadas = new BehaviorSubject<Quedada[]>([]);
  public  quedadas$ = this._quedadas.asObservable();

  constructor(private http: HttpClient) {}


  private mapOne = (q: ApiQuedada): Quedada => ({
    id: q._id,
    sectorId: q.sectorId,
    sectorNombre: q.sectorNombre,
    titulo: q.titulo,
    fecha: q.fecha,                 
    hora: q.hora,
    descripcion: q.descripcion,
    grado: q.grado,
    creador: q.creador,
    asistentes: q.asistentes || [],
    notas: q.notas,
    maxAsistentes: q.maxAsistentes,
    sectorCoords: q.sectorCoords,
    vehiculo: q.vehiculo,
    mascotas: q.mascotas,
    imageUrl: q.imageUrl
  });



  private upsert(list: Quedada[], item: Quedada) {
    const i = list.findIndex(x => x.id === item.id);
    if (i === -1) return [item, ...list];
    const copy = [...list];
    copy[i] = item;
    return copy;
  }

  /** Cargar todas */
  loadAll(): Observable<Quedada[]> {
    return this.http.get<ApiQuedada[]>(this.base).pipe(
      map(arr => arr.map(this.mapOne)),
      tap(list => this._quedadas.next(list)),
      catchError(err => {
        console.error('quedadas loadAll', err);
        this._quedadas.next([]);
        return of([]);
      })
    );
  }

  /** Obtener del store por id (si no existe aún, pide al backend) */
  getById(id: string): Observable<Quedada | undefined> {
    const current = this._quedadas.value.find(q => q.id === id);
    if (current) return of(current);
    return this.http.get<ApiQuedada>(`${this.base}/${id}`).pipe(
      map(this.mapOne),
      tap(q => this._quedadas.next(this.upsert(this._quedadas.value, q))),
      catchError(err => {
        console.error('quedadas getById', err);
        return of(undefined);
      })
    );
  }

  /** Crear */
  create(data: Partial<Quedada>): Observable<Quedada> {
    // enviamos sin 'id' y con fecha ISO si te viene separada
    const body: any = { ...data };
    return this.http.post<ApiQuedada>(this.base, body).pipe(
      map(this.mapOne),
      tap(q => this._quedadas.next(this.upsert(this._quedadas.value, q)))
    );
  }

  /** Actualizar */
  update(id: string, data: Partial<Quedada>): Observable<Quedada> {
    return this.http.put<ApiQuedada>(`${this.base}/${id}`, data).pipe(
      map(this.mapOne),
      tap(q => this._quedadas.next(this.upsert(this._quedadas.value, q)))
    );
  }

  /** Borrar */
  delete(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.base}/${id}`).pipe(
      tap(() => this._quedadas.next(this._quedadas.value.filter(q => q.id !== id)))
    );
  }

  /** Apuntarse */
  join(id: string, userId: string): Observable<Quedada> {
    return this.http.post<ApiQuedada>(`${this.base}/${id}/join`, { userId }).pipe(
      map(this.mapOne),
      tap(q => this._quedadas.next(this.upsert(this._quedadas.value, q)))
    );
  }

  /** Salir */
  leave(id: string, userId: string): Observable<Quedada> {
    return this.http.post<ApiQuedada>(`${this.base}/${id}/leave`, { userId }).pipe(
      map(this.mapOne),
      tap(q => this._quedadas.next(this.upsert(this._quedadas.value, q)))
    );
  }
}
