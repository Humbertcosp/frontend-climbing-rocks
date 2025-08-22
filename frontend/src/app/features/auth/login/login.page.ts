// login.page.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

// ✅ Typed forms: boolean, no 'true' literal
type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
  remember: FormControl<boolean>;
}>;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  form!: LoginForm;
  loading = false;
  error = '';
  showPass = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  ngOnInit(): void {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      // ✅ fuerza boolean explícito
      remember: this.fb.nonNullable.control<boolean>(true),
    });
  }

  get f() { return this.form.controls; }

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;

    const { email, password } = this.form.getRawValue(); // email: string, password: string

    this.auth.login(email, password).subscribe({
      next: async () => {
        this.loading = false;
        (await this.toast.create({ message: 'Bienvenido', duration: 1200, color: 'success' })).present();
        this.router.navigateByUrl('/home', { replaceUrl: true });
      },
      error: async (err) => {
        this.loading = false;
        (await this.toast.create({
          message: err?.error?.message || 'Credenciales inválidas',
          duration: 2500,
          color: 'danger'
        })).present();
      }
    });
  }
}
