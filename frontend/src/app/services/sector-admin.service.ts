import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SectorAdminService {
  private base = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  listReview() { return this.http.get<any[]>(`${this.base}/admin/sectores`); }
  approve(id: string, patch: any = {}) {
    return this.http.patch<any>(`${this.base}/admin/sectores/${id}`, { ...patch, status: 'published' });
  }
}
