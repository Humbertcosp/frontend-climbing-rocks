// src/app/services/sector.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sector } from '../features/models/sector.model';

@Injectable({ providedIn: 'root' })
export class SectoresService {
  private base = `${environment.apiUrl}/sectores`;
  private apiRoot = environment.apiUrl.replace(/\/api\/?$/, '');

  constructor(private http: HttpClient) {}

  list(): Observable<Sector[]> {
    return this.http.get<any[]>(this.base).pipe(
      map(items => items.map(it => this.toUi(it)))
    );
  }

  getById(id: string): Observable<Sector> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(
      map(s => this.toUi(s))
    );
  }

  // ---------- helpers ----------
  private fixUrl(u?: string): string {
    if (!u) return 'assets/sector-placeholder.jpg';
    if (/^https?:\/\//i.test(u)) return u;
    if (u.startsWith('/')) return this.apiRoot + u;
    return u;
  }

  /** Normaliza lo que venga del backend al shape que usa el front */
  private toUi(s: any): Sector {
    // Imagen de portada intentando varias claves
    const img =
      s.imageUrl ??
      s.cover_url ??
      s.coverUrl ??
      s.photos?.[0]?.url ??
      '';

    // Coordenadas del sector (location.coordinates = [lng, lat])
    const coords = s?.location?.coordinates;
    const lat = Array.isArray(coords) ? coords[1] : undefined;
    const lon = Array.isArray(coords) ? coords[0] : undefined;

    // Coordenadas del parking si existieran (por si lo añades en el futuro)
    const pcoords = s?.parking?.coordinates ?? s?.parking_location?.coordinates;
    const parkingLat = Array.isArray(pcoords) ? pcoords[1] : undefined;
    const parkingLon = Array.isArray(pcoords) ? pcoords[0] : undefined;

    // Tiempo de aproximación (alias camelCase y snake_case)
    const approachMin = s.approach_min ?? s.approachMin ?? undefined;

    return {
      id: String(s._id ?? s.id ?? ''),
      nombre: s.nombre ?? s.name ?? 'Sector',
      imageUrl: this.fixUrl(img),

      // metadatos
      area: s.area,
      country: s.country,
      region: s.region,
      rock: s.rock,
      styles: s.styles ?? [],
      orientation: s.orientation ?? [],
      season: s.season ?? [],
      shade: s.shade ?? [],
      routes: s.routes ?? undefined,
      grade_min: s.grade_min,
      grade_max: s.grade_max,
      description_md: s.description_md ?? s.description ?? '',

      source: s.source,
      source_url: s.source_url,
      license: s.license,
      last_scraped_at: s.last_scraped_at,
      last_ai_enriched_at: s.last_ai_enriched_at,
      status: s.status,

      // lo que usa la UI
      location: s.location,
      lat, lon,
      parkingLat, parkingLon,
      approachMin,                 // <-- alias cómodo para la UI
    } as Sector;
  }
}
