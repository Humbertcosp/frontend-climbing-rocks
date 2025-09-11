import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService, ThemeMode } from '../../../services/settings.service';
import { AuthService } from '../../../services/auth.service';
import { FollowService } from '../../../services/follow.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage {
  usuario: Usuario | null = null;

  followersCount = 0;
  followingCount = 0;

  isDarkMode = false;
  notificationsEnabled = false;
  currentLanguage = 'Español';
  appVersion = '1.0.0';

  constructor(
    public  auth: AuthService,
    private follow: FollowService,
    private settings: SettingsService,
    private router: Router
  ) {}

  /** Helpers para el template (evitan casts en HTML) */
  get avatarSrc(): string {
    const u: any = this.usuario || {};
    return u.avatarUrl || u.fotoPerfil || 'assets/avatar.svg';
  }
  get displayName(): string {
    return this.usuario?.nombre ?? '';
  }
  get displayEmail(): string {
    return this.usuario?.email ?? '';
  }

  private getUserId(u?: Usuario | null): string | undefined {
    return (u as any)?._id || (u as any)?.id;
  }

  async ionViewWillEnter() {
    await this.auth.refreshMe().toPromise();
    this.usuario = await this.auth.getCurrentUser();

    const uid = this.getUserId(this.usuario);
    if (uid) {
      this.follow.followers(uid).subscribe({
        next: arr => (this.followersCount = Array.isArray(arr) ? arr.length : 0),
        error: () => (this.followersCount = 0),
      });
      this.follow.following(uid).subscribe({
        next: arr => (this.followingCount = Array.isArray(arr) ? arr.length : 0),
        error: () => (this.followingCount = 0),
      });
    }

    this.isDarkMode = (await this.settings.getTheme()) === 'dark';
    this.notificationsEnabled = await this.settings.getNotificationsEnabled();
  }

  toggleTheme(checked: boolean) {
    this.isDarkMode = checked;
    this.settings.setTheme((checked ? 'dark' : 'light') as ThemeMode);
  }

  toggleNotifications(checked: boolean) {
    this.notificationsEnabled = checked;
    this.settings.setNotificationsEnabled(checked);
  }

  editProfile()          { this.router.navigate(['/profile/details']); }
  openAccountSettings()  { this.router.navigate(['/profile/account']); }
  changePassword()       { this.router.navigate(['/profile/change-password']); }
  openLanguageSelector() { this.router.navigate(['/profile/language']); }
  openPrivacyPolicy()    { this.router.navigate(['/profile/privacy-policy']); }
  openTerms()            { this.router.navigate(['/profile/terms']); }
  openHelp()             { this.router.navigate(['/profile/help']); }
  openAbout()            { this.router.navigate(['/profile/about']); }

  async logout() {
    await this.auth.logout();
    this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}
