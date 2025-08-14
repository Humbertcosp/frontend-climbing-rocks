import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({   
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage {
  email = '';
  password = '';
  error = '';
  

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigateByUrl('/quedadas', { replaceUrl: true });
    } catch (e) {
      this.error = 'Credenciales inválidas';
    }
  }
}
