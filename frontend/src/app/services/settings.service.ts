import { Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private _theme: ThemeMode = 'light';
  private _notifications = true;
  private _language = 'Español';  

  /** Devuelve el tema actual */
  async getTheme(): Promise<ThemeMode> {
    return this._theme;
  }

  /** Cambia el tema y actualiza la clase en <body> */
  async setTheme(mode: ThemeMode): Promise<void> {
    this._theme = mode;
    document.body.classList.toggle('dark', mode === 'dark');
  }

  /** Devuelve si las notificaciones están activas */
  async getNotificationsEnabled(): Promise<boolean> {
    return this._notifications;
  }

  /** Activa/desactiva notificaciones */
  async setNotificationsEnabled(enabled: boolean): Promise<void> {
    this._notifications = enabled;
    // aquí podrías poner la lógica de registrar push / web-notifications
  }
    async getLanguage(): Promise<string> {
    return this._language;
  }

  /** Nuevo: cambia el idioma */
  async setLanguage(lang: string): Promise<void> {
    this._language = lang;
    // aquí podrías recargar textos, poner ngx-translate, etc.
  }
}