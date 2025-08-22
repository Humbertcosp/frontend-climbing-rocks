import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterDTO } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  loading = false;
  error = '';
  showPass = false;
  showConfirm = false;
  avatarPreview: string | null = null;
  avatarFile: File | null = null;

  form = this.fb.group({
    // OJO: el backend espera "nombre"
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        // al menos 1 mayúscula, 1 minúscula y 1 número
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]
    ],
    confirmar: ['', [Validators.required]],
    telefono: ['', [Validators.pattern(/^\+?\d{7,15}$/)]],
    ciudad: [''],
    pais: ['ES'],
    fechaNacimiento: [''],
    newsletter: [true],
    aceptaTerminos: [false, Validators.requiredTrue],
  }, { validators: [passwordsMatchValidator] });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  get f() { return this.form.controls; }

  get passwordStrength(): 'débil' | 'media' | 'fuerte' | '' {
    const v = this.f.password.value || '';
    if (!v) return '';
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v)) score++;
    if (/[a-z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    if (score <= 2) return 'débil';
    if (score === 3 || score === 4) return 'media';
    return 'fuerte';
  }

  onAvatarChange(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.avatarFile = file;
    const reader = new FileReader();
    reader.onload = () => this.avatarPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    const v = this.form.value;

    const dto: RegisterDTO = {
      nombre: v.nombre!,
      email: v.email!,
      password: v.password!,
      telefono: v.telefono || undefined,
      ciudad: v.ciudad || undefined,
      pais: v.pais || undefined,
      fechaNacimiento: v.fechaNacimiento || undefined,
      newsletter: !!v.newsletter,
      
    };

    this.auth.register(dto).subscribe({
      next: () => this.router.navigateByUrl('/home', { replaceUrl: true }),
      error: (e) => {
        this.error = e?.error?.message || 'No se pudo completar el registro';
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }

}

// ----- Validators helpers -----
function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const conf = group.get('confirmar')?.value;
  if (!pass || !conf) return null;
  return pass === conf ? null : { passwordsMismatch: true };
}
