import { Component, OnInit }      from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router }                  from '@angular/router';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: false,
  
})
export class ChangePasswordPage implements OnInit {
  form!: FormGroup;
  showCurrent = false;
  showNew     = false;
  showRepeat  = false;
  errorMsg    = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,

  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      current: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]],
    }, { validators: this.matchingPasswords });
  }

  private matchingPasswords(fg: FormGroup) {
    return fg.get('password')!.value === fg.get('confirm')!.value
      ? null
      : { notMatching: true };
  }

  async submit() {
    if (this.form.invalid) return;
    const { current, password } = this.form.value;
    try {
     
      await this.auth.changePassword(current, password);
      this.router.navigate(['/profile/account'], { replaceUrl: true });
    } catch (err) {
      this.errorMsg = 'Error al cambiar la contraseña';
    }
  }
}