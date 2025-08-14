import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Usuario } from '../../app/features/models/usuario.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private USER_KEY = 'current-user';
  private _storageReady = false;
  private _user$ = new BehaviorSubject<Usuario| null>(null);
  public user$ = this._user$.asObservable();

  constructor(private storage: Storage, private http: HttpClient) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    this._storageReady = true;
    const saved = await this.storage.get(this.USER_KEY);
    if (saved) this._user$.next(saved);
  }

  
  async login(email: string, password: string): Promise<Usuario> {
    const url = 'https://tu-backend.com/api/login';
    const res: any = await this.http.post(url, { email, password }).toPromise();
    const user: Usuario = res.user;
    
    
    // guarda en storage
    await this.storage.set(this.USER_KEY, user);
    this._user$.next(user);
    return user;
  }

  async register(name: string, email: string, password: string): Promise<Usuario> {
    const url = 'https://tu-backend.com/api/register';
    const res: any = await this.http.post(url, { name, email, password }).toPromise();
    const user: Usuario = res.user;
    await this.storage.set(this.USER_KEY, user);
    this._user$.next(user);
    return user;
  }

    async getCurrentUser(): Promise<Usuario|null> {
    if (!this._storageReady) {
      await this.init();
    }
    const user = await this.storage.get(this.USER_KEY);
    // opcional: this._user$.next(user);
    return user;                     // <<<–– ¡Asegúrate de retornar!
  }

  async logout(): Promise<void> {
    await this.storage.remove(this.USER_KEY);
    this._user$.next(null);
  }

  async changePassword(current: string, next: string): Promise<void> {
  console.log('Cambio de contraseña:', current, '→', next);

}
}
