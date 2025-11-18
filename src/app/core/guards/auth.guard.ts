import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function authGuard() {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Check if already authenticated through user state
  if (authService.isAuthenticated()) {
    return true;
  }

  // If not authenticated, try to validate token and load user data
  return authService.validateToken().pipe(
    map(isValid => isValid ? true : router.createUrlTree(['/auth/login']))
  );
}
