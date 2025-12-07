import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.routes').then(m => m.PROFILE_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'qr',
    loadComponent: () => import('./features/qr/qr-generator/qr-generator.component').then(m => m.QrGeneratorComponent)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];
