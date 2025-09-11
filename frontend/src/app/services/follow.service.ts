import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

export interface FollowUser {
  _id: string;
  nombre?: string;
  name?: string;
  fotoPerfil?: string;
  avatarUrl?: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class FollowService {
  private base = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  follow(userId: string)   { return this.http.post(`${this.base}/${userId}/follow`, {}); }
  unfollow(userId: string) { return this.http.delete(`${this.base}/${userId}/follow`); }

  isFollowing(userId: string): Observable<boolean> {
    return this.http.get<{ following: boolean }>(`${this.base}/${userId}/is-following`)
      .pipe(map(r => !!r.following));
  }

  followers(userId: string): Observable<FollowUser[]> {
    return this.http.get<any[]>(`${this.base}/${userId}/followers`);
  }

  following(userId: string): Observable<FollowUser[]> {
    return this.http.get<any[]>(`${this.base}/${userId}/following`);
  }
}
