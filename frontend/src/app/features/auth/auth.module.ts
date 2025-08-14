import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RegisterPage } from './register/register.page';
import {  AuthRoutingModule } from './auth-routing.module';
import { LoginPage } from './login/login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuthRoutingModule
    
  ],
  declarations: [RegisterPage, LoginPage]
})
export class AuthModule {}
