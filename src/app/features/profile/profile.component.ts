import { Component, computed, effect, inject, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { MessageResponse, User } from '../../core/interfaces';
import { FloatLabel } from 'primeng/floatlabel';
import { Profile, PetInfo } from '../../core/interfaces/index';
import { CursorOnFocusDirective } from '../../core/directives/cursor-on-focus.directive';
import { UserStateService } from '../../core/services/store/user-state.service';
import { UserService } from '../../core/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { hasUnchangedValue } from '../../core/form-validators/form-equality.validator';
import { normalizeFormValue } from '../../core/form-validators/validator-utils';
import { noSpacesValidator } from '../../core/form-validators/no-space-validator';
import { AccordionModule } from 'primeng/accordion';

// Define the shape of route data
interface ProfileRouteData {
  user: User | null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DividerModule,
    FloatLabel,
    CursorOnFocusDirective,
    AccordionModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  readonly #userStateService = inject(UserStateService);
  readonly #userService = inject(UserService);
  readonly #resolverData = toSignal(this.route.data) as () => ProfileRouteData | undefined;

  // readonly #userData =

  profileForm: FormGroup = this.fb.group({
    ownerName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    pets: this.fb.array([this.createPetFormGroup()]),
  });

  // private readonly user = signal<User | null>(null);

  readonly isLoading = signal(false);
  readonly hasChanges = computed(() => this.profileForm?.dirty || false);

  get pets(): FormArray {
    return this.profileForm.get('pets') as FormArray;
  }

  constructor() {
    effect(() => {
      const resolverUser = this.#resolverData()?.user;
      const stateUser = this.#userStateService.user();

      const userData = stateUser || resolverUser;
      console.log('User data was updated: ', userData);
      if (userData) {
        this.populateForm(userData);
      }
    });
  }

  ngOnInit() {
    // this.loadUserProfile();
  }

  createPetFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  private populateForm(userData: User): void {
    this.profileForm.patchValue(
      {
        ownerName: userData.ownerName,
        email: userData.email,
      },
      { emitEvent: false }
    );

    this.pets.clear();

    userData.pets?.forEach((pet: PetInfo) => {
      this.pets.push(
        this.fb.group(
          {
            name: [pet.name, [Validators.required, noSpacesValidator()]],
            type: [pet.type, [Validators.required, noSpacesValidator()]],
          },
          {
            asyncValidators: hasUnchangedValue(normalizeFormValue(pet, 'name')),
          }
        )
      );
    });

    this.profileForm.markAsPristine();

    console.log('Form populated with pets:', this.pets.controls.length);
  }

  /*************************
  **        ACTIONS       **
  **************************/
  addPet(): void {
    this.pets.push(this.createPetFormGroup());
    this.profileForm.markAsDirty();
  }

  deletePet(index: number): void {
    const petId = this.#userStateService.user()?.pets?.[index]?.id;
    console.log('Deleting pet with ID:', petId);
    if (petId) {
      this.#userService.removePetFromProfile(petId).subscribe();
    } else {
      this.pets.removeAt(index);
    }
    this.profileForm.markAsDirty();
  }

  clearPetForm(index: number): void {
    this.pets.at(index).reset();
    this.profileForm.markAsUntouched();
  }

  savePet(index: number): void {
    this.#userService.addPetToProfile(this.pets.at(index).value).subscribe();
    // this.profileForm.markAsUntouched();
  }

  onFieldBlur(fieldName: string, index: number = -1): void {
    const control =
      index > -1
        ? (this.profileForm.get('pets') as FormArray).at(index).get(fieldName)
        : this.profileForm.get(fieldName);
    control?.markAsTouched();
  }

  onFieldFocus(fieldName: string, index: number = -1): void {
    const control =
      index > -1
        ? (this.profileForm.get('pets') as FormArray).at(index).get(fieldName)
        : this.profileForm.get(fieldName);
    control?.markAsUntouched();
  }

  isFieldInvalid(fieldName: string, index: number = -1): boolean {
    const control =
      index > -1
        ? (this.profileForm.get('pets') as FormArray).at(index).get(fieldName)
        : this.profileForm.get(fieldName);

    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  signOut(): void {
    this.authService.signOut().subscribe((response: MessageResponse) => {
      this.messageService.add({
        severity: 'info',
        summary: 'Signed Out',
        detail: response.message || 'You have been signed out successfully.',
      });

      this.router.navigate(['/auth/login']);
    });
  }

  async onSubmit() {
    if (this.profileForm.valid && this.profileForm.dirty) {
      this.isLoading.set(true);

      try {
        const formData = this.profileForm.value;
        await this.authService
          .updateProfile({
            ownerName: formData.ownerName,
            email: formData.email,
            pets: formData.pets,
          })
          .toPromise();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully',
        });

        this.profileForm.markAsPristine();
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update profile',
        });
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
