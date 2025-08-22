import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';

@NgModule({
  declarations: [LoginPage, RegisterPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule, 
    AuthRoutingModule
  ],
})
export class AuthModule {}
