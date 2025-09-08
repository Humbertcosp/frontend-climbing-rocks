import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  async canActivate(): Promise<boolean | UrlTree> {
    const u = await this.auth.getCurrentUser();
    return u ? this.router.parseUrl('/home') : true;
  }
}