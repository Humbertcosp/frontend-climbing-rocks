import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

   { path: 'login', redirectTo: 'auth/login', pathMatch: 'full' },
   { path: 'register', redirectTo: 'auth/register', pathMatch: 'full' },

  // Tus rutas existentes
  { path: 'home',     loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'sectores', loadChildren: () => import('./features/sectores/sectores.module').then(m => m.SectoresModule) },
  { path: 'quedadas', loadChildren: () => import('./features/quedadas/quedadas.module').then(m => m.QuedadasModule) },
  { path: 'chats',    loadChildren: () => import('./features/chat/chat.module').then(m => m.ChatModule) },
  { path: 'profile',  loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },

  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
