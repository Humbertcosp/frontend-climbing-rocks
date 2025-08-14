import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  async register() {
    try {
      await this.auth.register(this.name, this.email, this.password);
      this.router.navigateByUrl('/quedadas', { replaceUrl: true });
    } catch (e) {
      this.error = 'No se pudo registrar';
    }
  }
}

