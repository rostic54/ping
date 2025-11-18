import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces';
import { TokenService } from './token.service';
import { UserStateService } from './store/user-state.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly userStore = inject(UserStateService);
  
  private readonly authState = signal<boolean>(false);

  readonly isAuthenticated = computed(() => this.authState());
  readonly currentUser = computed(() => this.userStore.user());

  private setUser(user: User | null): void {
    this.userStore.setUser(user);
    this.authState.set(user !== null);
  }

  /**
   * Attempts to log in a user with the provided email and password.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns An Observable that emits true if login is successful, false otherwise.
   */
  login(email: string, password: string): Observable<boolean> {
    return this.httpClient.post<User | null>(`${environment.apiUrl}/auth/login`, {email, password}).pipe(
      tap((response: User | null) => this.setUser(response)),
      map(response => response !== null)
    );
  }

  registerWithGroupID(email: string, name: string, id: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`${environment.apiUrl}/auth/short-register`, { email, name, id });
  }

  /**
   * Validates the current token and loads user data if token is valid
   * @returns Observable resolving to true if validation successful, false otherwise
   */
  validateToken(): Observable<boolean> {
    return this.tokenService.validateToken().pipe(
      map((response: User | null) => {
        if (!response) {
          this.setUser(null);
          return false;
        }
        this.setUser(response);
        return true;
      })
    );
  }

  registerFull(
    email: string,
    password: string,
    ownerName: string
  ): Observable<boolean> {
    return this.httpClient
      .post<boolean>(`${environment.apiUrl}/auth/register`, { email, password, ownerName });
  }

  async verifyOtp(email: string, otp: string) {
    // TODO: Implement OTP verification
    return true;
  }

  async setNewPassword(newPassword: string) {
    // TODO: Implement password change
    return true;
  }

  logout(): void {
    this.setUser(null);
  }

  getUserInfo(): Observable<User | null> {
    return this.httpClient.get<User>(`${environment.apiUrl}/profile`).pipe(
      tap(user => this.setUser(user)),
      catchError(() => of(null))
    );
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.httpClient.patch<User>(`${environment.apiUrl}/auth/profile`, userData).pipe(
      tap(user => this.setUser(user))
    );
  }


}
