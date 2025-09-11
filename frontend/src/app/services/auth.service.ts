// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable, from, switchMap, map, of, tap, catchError } from 'rxjs';
import { Usuario } from '../features/models/usuario.model';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

type AuthResponse = { token: string; user: Usuario };

export type RegisterDTO = {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  ciudad?: string;
  pais?: string;
  fechaNacimiento?: string;
  newsletter?: boolean;
  avatarUrl?: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private USER_KEY = 'current-user';
  private _storageReady = false;

  private _user$ = new BehaviorSubject<Usuario | null>(null);
  public user$ = this._user$.asObservable();

  private base = `${environment.apiUrl}/auth`;

  constructor(private storage: Storage, private http: HttpClient) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    this._storageReady = true;
    const saved = await this.storage.get(this.USER_KEY);
    if (saved) this._user$.next(saved);
  }

  login(email: string, password: string): Observable<Usuario> {
    return this.http.post<AuthResponse>(`${this.base}/login`, { email, password }).pipe(
      switchMap(res => from(this.saveSession(res)).pipe(map(() => res.user)))
    );
  }

  register(payload: RegisterDTO): Observable<Usuario> {
    return this.http.post<AuthResponse>(`${this.base}/register`, payload).pipe(
      switchMap(res => from(this.saveSession(res)).pipe(map(() => res.user)))
    );
  }

  async getCurrentUser(): Promise<Usuario | null> {
    if (!this._storageReady) await this.init();
    return this.storage.get(this.USER_KEY);
  }

  async changePassword(current: string, next: string): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${this.base}/change-password`, { current, next }));
  }

  async logout(): Promise<void> {
    if (!this._storageReady) await this.storage.create();
    localStorage.removeItem('token');
    await this.storage.remove(this.USER_KEY);
    this._user$.next(null);
  }

  private async saveSession(res: AuthResponse): Promise<void> {
    localStorage.setItem('token', res.token);
    await this.storage.set(this.USER_KEY, res.user);
    this._user$.next(res.user);
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }


  async getToken(): Promise<string | null> {
    return this.token; 
  }

  me() {
    return this.http.get<{ user: Usuario }>(`${this.base}/me`).pipe(map(r => r.user));
  }

  refreshMe() {
    const token = this.token;
    if (!token) {
      this._user$.next(null);
      return of(null);
    }
    return this.me().pipe(
      tap(async u => {
        await this.storage.set(this.USER_KEY, u);
        this._user$.next(u);
      }),
      catchError(() => of(null))
    );
  }
}
