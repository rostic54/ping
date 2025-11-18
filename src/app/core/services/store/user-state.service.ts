import { Injectable, computed, signal } from '@angular/core';
import { PetInfo, User } from '../../interfaces';

export interface UserState {
user: User | null,
isLoading?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  // private readonly userState = signal<User | null>(null);

  // state
  private state = signal<UserState>({
    user: null,
    isLoading: false
  });

  readonly user = computed(() => {
    const currentUser = this.state().user;
    console.log('UserStateService - user computed triggered, returning:', currentUser);
    return currentUser; 
  });
  readonly isLoading = computed(() => this.state().isLoading);

  setUser(user: User| null): void {
    console.log('Setting user in UserStateService:', user);
    console.log('Current state before update:', this.state().user);
    
    this.state.update((currentState) => {
      const newState = {
        ...currentState,
        user: user ? { ...user } : null, // Create a new user object to ensure reference change
        isLoading: false
      };
      console.log('New state after update:', newState.user);
      return newState;
    });
  }

  setLoading(isLoading: boolean): void {
    this.state.update((currentState) => ({...currentState, isLoading}));
  } 

  reset(): void {
    this.state.set({
      user: null,
      isLoading: false
    });
  }
}
