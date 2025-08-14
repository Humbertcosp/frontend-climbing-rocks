import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { AuthService }   from '../../../services/auth.service';
import { Usuario }       from '../../models/usuario.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false
})
   
  export class AccountPage implements OnInit {
  // 1) Modelo Usuario inicializado con valores por defecto
  usuario: Usuario = {
    id: '',
    nombre: 'Humbert',
    avatarUrl: 'assets/icon/favicon.png',
    email: '',
  };

  // 2) Declaramos el flag de 2FA
  twoFactorEnabled = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Cargamos el usuario (stub o real cuando implementes el backend)
    const u = await this.auth.getCurrentUser();
    if (u) {
      this.usuario = u;
    }

    // Inicializamos 2FA
    this.twoFactorEnabled = false;
  }

  /** Acción de cambiar avatar */
  changeAvatar() {
    // Por ejemplo: abrir un file-picker o la cámara
    console.log('Cambiar avatar...');
  }

  /** Navegar a la página de edición de un campo */
  editField(field: 'nombre' | 'email' | 'telefono') {
    this.router.navigate(['/profile/account/edit', field]);
  }

  /** Redirige a cambiar contraseña */
  changePassword() {
    this.router.navigate(['/profile/change-password']);
  }

  /** Activa/desactiva autenticación de dos pasos */
  toggleTwoFactor() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    console.log('2FA ahora', this.twoFactorEnabled);
  }

  /** Eliminar cuenta tras confirmación */
  deleteAccount() {
    if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      this.auth.logout();
      this.router.navigateByUrl('/auth/login', { replaceUrl: true });
    }
  }
}