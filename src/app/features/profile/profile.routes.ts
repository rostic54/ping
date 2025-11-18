import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { userResolver } from './core/profile.resolver';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfileComponent,
    resolve: {
      user: userResolver
    } 
  }
];