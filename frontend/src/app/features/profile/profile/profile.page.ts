import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { SettingsService, ThemeMode } from '../../../services/settings.service';
import { AuthService }                 from '../../../services/auth.service';
import { Usuario }                     from '../../models/usuario.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  usuario: Usuario = {
    id: '',
    nombre: 'Humbert',
    avatarUrl: 'assets/icon/favicon.png',
    email: ''
  };

  isDarkMode = false;
  notificationsEnabled = false;
  currentLanguage = 'Español';
  appVersion = '1.0.0';

  constructor(
    private auth: AuthService,
    private settings: SettingsService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Carga perfil stub (o auténtico cuando tengas backend)
    const u = await this.auth.getCurrentUser();
    if (u) {
      this.usuario = u;
    }

    // Carga preferencias stub
    this.isDarkMode = (await this.settings.getTheme()) === 'dark';
    this.notificationsEnabled = await this.settings.getNotificationsEnabled();
  }

  /** Cambia el tema y actualiza la UI */
  toggleTheme(checked: boolean) {
    this.isDarkMode = checked;
    this.settings.setTheme(checked ? 'dark' : 'light' as ThemeMode);
  }

  /** Activa/desactiva notificaciones */
  toggleNotifications(checked: boolean) {
    this.notificationsEnabled = checked;
    this.settings.setNotificationsEnabled(checked);
  }

  // Navegaciones a sub-páginas de perfil
  editProfile()           { this.router.navigate(['/profile/details']); }
  openAccountSettings()   { this.router.navigate(['/profile/account']); }
  changePassword()        { this.router.navigate(['/profile/change-password']); }
  openLanguageSelector()  { this.router.navigate(['/profile/language']); }
  openPrivacyPolicy()     { this.router.navigate(['/profile/privacy-policy']); }
  openTerms()             { this.router.navigate(['/profile/terms']); }
  openHelp()              { this.router.navigate(['/profile/help']); }
  openAbout()             { this.router.navigate(['/profile/about']); }

  /** Cierra sesión y redirige al login */
  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}