import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable, from, switchMap, map } from 'rxjs';
import { Usuario } from '../features/models/usuario.model';
import { environment } from '../../environments/environment';

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
  avatarUrl?: string; // si algún día subes/guardas el avatar
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private USER_KEY = 'current-user';
  private _storageReady = false;

  private _user$ = new BehaviorSubject<Usuario | null>(null);
  public  user$ = this._user$.asObservable();

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

  /** LOGIN -> Observable<Usuario> */
  login(email: string, password: string): Observable<Usuario> {
    return this.http.post<AuthResponse>(`${this.base}/login`, { email, password }).pipe(
      switchMap(res => from(this.saveSession(res)).pipe(map(() => res.user)))
    );
  }

  /** REGISTER -> Observable<Usuario>
   *  (recibe un objeto, así evitas el error “Expected 3 arguments…”) */
  register(payload: RegisterDTO): Observable<Usuario> {
    return this.http.post<AuthResponse>(`${this.base}/register`, payload).pipe(
      switchMap(res => from(this.saveSession(res)).pipe(map(() => res.user)))
    );
  }

  /** Obtener usuario actual (promise) */
  async getCurrentUser(): Promise<Usuario | null> {
    if (!this._storageReady) await this.init();
    return this.storage.get(this.USER_KEY);
  }

  /** Logout */
  async logout(): Promise<void> {
    localStorage.removeItem('token');
    await this.storage.remove(this.USER_KEY);
    this._user$.next(null);
  }

  /** Guardado de sesión */
  private async saveSession(res: AuthResponse): Promise<void> {
    localStorage.setItem('token', res.token);
    await this.storage.set(this.USER_KEY, res.user);
    this._user$.next(res.user);
  }

  /** (opcional) token getter */
  get token(): string | null {
    return localStorage.getItem('token');
  }

  /** (opcional) cambio de contraseña */
  async changePassword(current: string, next: string): Promise<void> {
    console.log('Cambio de contraseña:', current, '→', next);
  }

}
