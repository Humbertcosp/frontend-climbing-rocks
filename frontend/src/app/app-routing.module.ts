// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';   

const routes: Routes = [
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },

 
  { path: 'login',    redirectTo: 'auth/login',    pathMatch: 'full' },
  { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },

  { path: 'home',     canActivate: [AuthGuard], loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'sectores', canActivate: [AuthGuard], loadChildren: () => import('./features/sectores/sectores.module').then(m => m.SectoresModule) },
  { path: 'explorar',  loadChildren: () => import('./features/explore/explore.module').then(m => m.ExplorePageModule) },
  { path: 'quedadas', canActivate: [AuthGuard], loadChildren: () => import('./features/quedadas/quedadas.module').then(m => m.QuedadasModule) },
  { path: 'chats',    canActivate: [AuthGuard], loadChildren: () => import('./features/chat/chat.module').then(m => m.ChatModule) },
  { path: 'profile',  canActivate: [AuthGuard], loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },
  



  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },

  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}