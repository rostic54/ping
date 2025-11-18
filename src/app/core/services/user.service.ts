import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { tap, map, Observable, finalize } from 'rxjs';
import { ApiResponse, PetInfo, User } from '../interfaces';
import { UserStateService } from './store/user-state.service';
import { ToasterService } from './utils/toaster.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly userStore = inject(UserStateService);
  readonly #toasterService = inject(ToasterService);

  constructor() {}

  private setUser(user: User | null): void {
    this.userStore.setUser(user);
  }

  public getUserProfile(): Observable<boolean> {
    this.userStore.setLoading(true);
    return this.httpClient.get<User | null>(`${environment.apiUrl}/profile`).pipe(
      tap((response) => this.setUser(response)),
      map((response) => response !== null),
      finalize(() => this.userStore.setLoading(false))
    );
  }

  public updateUserProfile(profileData: Partial<User>): Observable<boolean> {
    return this.httpClient.put<ApiResponse<User>>(`${environment.apiUrl}/profile`, profileData).pipe(
      tap((response) => {
        this.setUser(response.user ?? null);
        this.#toasterService.showSuccess(response.message || 'Profile updated successfully');
      }),
      map((updatedUser) => updatedUser.user !== null)
    );
  }

  public addPetToProfile(petData: PetInfo): Observable<boolean> {
    return this.httpClient.post<ApiResponse<User>>(`${environment.apiUrl}/user/pets`, petData).pipe(
      tap((response) => {
        this.setUser(response.user ?? null);
        this.#toasterService.showSuccess(response.message || 'Pet added successfully');
      }),
      map((updatedUser) => updatedUser.user !== null)
    );
  }

  public updatePetInProfile(petId: string, petData: Partial<PetInfo>): Observable<boolean> {
    return this.httpClient.put<ApiResponse<User>>(`${environment.apiUrl}/user/pets/${petId}`, petData).pipe(
      tap((updatedUser: ApiResponse<User>) => {
        this.setUser(updatedUser.user ?? null);
        this.#toasterService.showSuccess(updatedUser.message || 'Pet updated successfully');
      }),
      map((updatedUser: ApiResponse<User>) => updatedUser.user !== null)
    );
  }

  public removePetFromProfile(petId: string): Observable<boolean> {
    return this.httpClient.delete<ApiResponse<User>>(`${environment.apiUrl}/user/pets/${petId}`).pipe(
      tap((updatedUser: ApiResponse<User>) => {
        console.log('removePetFromProfile response:', updatedUser);
        this.setUser(updatedUser.user ?? null);
        this.#toasterService.showSuccess(updatedUser.message || 'Pet removed successfully');
      }),
      map((updatedUser: ApiResponse<User>) => updatedUser.user !== null)
    );
  }


}
