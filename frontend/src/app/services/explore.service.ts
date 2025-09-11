import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExploreService {
  private base = '/explore';

  constructor(private http: HttpClient) {}

  posts(opts: { page?: number; limit?: number; media?: boolean; q?: string; days?: number } = {}) {
    let p = new HttpParams();
    if (opts.page)  p = p.set('page',  String(opts.page));
    if (opts.limit) p = p.set('limit', String(opts.limit));
    if (opts.media !== undefined) p = p.set('media', String(opts.media));
    if (opts.q)     p = p.set('q', opts.q);
    if (opts.days)  p = p.set('days', String(opts.days));
    return this.http.get<{ page:number; limit:number; data:any[] }>(`${this.base}/posts`, { params: p });
  }

  people(opts: { page?: number; limit?: number } = {}) {
    let p = new HttpParams();
    if (opts.page)  p = p.set('page',  String(opts.page));
    if (opts.limit) p = p.set('limit', String(opts.limit));
    return this.http.get<{ page:number; limit:number; data:any[] }>(`${this.base}/people`, { params: p });
  }
}
