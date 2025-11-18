import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Validates the auth token by making a request to the server
   * @returns Observable<boolean> true if token is valid, false otherwise
   */
  validateToken(): Observable<User | null> {
    return this.httpClient.get<{message: string, user: User | null}>(`${environment.apiUrl}/auth/validate-token`).pipe(
      map(response => response.user),
      catchError(() => of(null))
    );
  }
}