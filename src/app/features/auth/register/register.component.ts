import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GroupService } from '../../../core/services/group.service';
import { CursorOnFocusDirective } from '../../../core/directives/cursor-on-focus.directive';
import { CommonPrimeNGImports } from '../../../core/module-imports/common-primeng';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs/internal/operators/tap';

interface BaseFormData {
  ownerName: string;
  email: string;
}

interface FullFormData extends BaseFormData {
  password: string;
  repeatPassword: string;
}

interface BaseFormModel {
  ownerName: FormControl<string>;
  email: FormControl<string>;
}

interface FullFormModel extends BaseFormModel {
  password: FormControl<string>;
  repeatPassword: FormControl<string>;
}

type BaseFormGroup = FormGroup<BaseFormModel>;
type FullFormGroup = FormGroup<FullFormModel>;
type RegisterFormGroup = BaseFormGroup | FullFormGroup;
type FormValidationKeys = {
  touched: boolean;
  invalid: boolean;
  dirty: boolean;
  errors: ValidationErrors;
  key: string;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CommonPrimeNGImports,
    CursorOnFocusDirective,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private valueChangesSub?: { unsubscribe: () => void };
  private statusChangesSub?: { unsubscribe: () => void };
  private formState = signal<FormValidationKeys[] | undefined>(undefined);

  private readonly fieldLabels: Record<string, string> = {
    email: 'Email address',
    password: 'Password',
    repeatPassword: 'Password confirmation',
    ownerName: 'Owner name',
  };

  public groupId?: string;
  public groupName?: string;
  public registerForm!: RegisterFormGroup;

  formControlErrors = computed(() => {
    return this.errorsTracker();
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private groupService: GroupService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['groupId']) {
        this.groupId = params['groupId'];
        const group = this.groupService.getGroupById(this.groupId);
        if (group) {
          this.groupName = group.name;
        }
      }
      this.initializeForm();
    });
  }

  private errorsTracker(): string[] {
    const controls = this.formState();
    if (!controls) {
      return [];
    }

    const errors: string[] = [];

    // Iterate controls via form.controls
    controls.forEach((control: FormValidationKeys) => {
      if (control.errors && control.touched && control.dirty) {
        const { errors: controlErrors } = control;
        if (controlErrors['required']) {
          errors.push(`${this.getFieldLabel(control.key)} is required`);
        }
        if (controlErrors['email']) {
          errors.push('Please enter a valid email address');
        }
        if (controlErrors['minlength']) {
          errors.push(
            `${this.getFieldLabel(control.key)} must be at least ${
              controlErrors['minlength'].requiredLength
            } characters`
          );
        }
        if (controlErrors['pattern'] && control.key === 'password') {
          errors.push('Password must contain uppercase, lowercase, number and special character');
        }
        if (controlErrors['passwordMismatch']) {
          errors.push('Passwords do not match');
        }
      }
    });

    return errors;
  }

  private getFieldLabel(key: string): string {
    return this.fieldLabels[key] || key;
  }

  private isFullFormGroup(form: BaseFormGroup | FullFormGroup): form is FullFormGroup {
    return 'password' in form.controls && 'ownerName' in form.controls;
  }

  private getControl(name: keyof (BaseFormModel & FullFormModel)): AbstractControl | null {
    if (!this.registerForm) return null;

    // For base fields, we can access them directly
    if (name === 'ownerName' || name === 'email') {
      return this.registerForm.controls[name];
    }

    // For full form fields, we need to check the form type first
    if (this.isFullFormGroup(this.registerForm)) {
      return this.registerForm.controls[name];
    }

    return null;
  }

  private initializeBaseForm(): BaseFormGroup {
    return this.fb.group({
      ownerName: ['', { nonNullable: true, validators: [Validators.required] }],
      email: ['', { nonNullable: true, validators: [Validators.required, Validators.email] }],
    }) as BaseFormGroup;
  }

  private initializeForm(): void {
    if (!this.groupId) {
      // Full registration form with password fields
      const fullForm = this.fb.group(
        {
          ownerName: ['', { nonNullable: true, validators: [Validators.required] }],
          email: ['', { nonNullable: true, validators: [Validators.required, Validators.email] }],
          password: [
            '',
            {
              nonNullable: true,
              validators: [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                ),
              ],
            },
          ],
          repeatPassword: ['', { nonNullable: true, validators: [Validators.required] }],
        },
        {
          validators: [this.passwordMatchValidator()],
        }
      ) as FullFormGroup;

      this.registerForm = fullForm;
    } else {
      // Simple form for group registration
      this.registerForm = this.initializeBaseForm();
    }

    this.formState.set(this.getValidationKeys(this.registerForm));

    this.valueChangesSub = this.registerForm.valueChanges.subscribe(() => {
      this.formState.set(this.getValidationKeys(this.registerForm));
    });

    this.statusChangesSub = this.registerForm.statusChanges.subscribe(() => {
      this.formState.set(this.getValidationKeys(this.registerForm));
    });
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
    this.statusChangesSub?.unsubscribe();
  }

  onFieldBlur(fieldName: keyof (BaseFormModel & FullFormModel)): void {
    const control = this.getControl(fieldName);
    control?.markAsTouched();
    this.formState.set(this.getValidationKeys(this.registerForm));
  }

  onFieldFocus(fieldName: keyof (BaseFormModel & FullFormModel)): void {
    const control = this.getControl(fieldName);
    control?.markAsUntouched();
  }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!(control instanceof FormGroup)) {
        return null;
      }

      const password = control.get('password');
      const repeatPassword = control.get('repeatPassword');

      if (!password || !repeatPassword) return null;

      const matches = password.value === repeatPassword.value;
      if (!matches) {
        repeatPassword.setErrors({ passwordMismatch: true });
      } else {
        // Clear passwordMismatch error if passwords match
        const errors = { ...repeatPassword.errors };
        if (errors) {
          delete errors['passwordMismatch'];
          repeatPassword.setErrors(Object.keys(errors).length ? errors : null);
        }
      }

      return matches ? null : { passwordMismatch: true };
    };
  }

  private getValidationKeys(form: RegisterFormGroup): FormValidationKeys[] {
    return Object.entries(form.controls).map(([key, control]) => {
      return {
        key,
        dirty: control?.dirty ?? false,
        invalid: control?.invalid ?? false,
        touched: control?.touched ?? false,
        errors: control?.errors ?? {},
      };
    });
  }

  onSubmit(): void {
    if (!this.registerForm?.valid) {
      // Mark all fields as touched to show errors
      Object.values(this.registerForm?.controls ?? {}).forEach((control) => {
        control?.markAsTouched();
      });
      return;
    }

    try {
      const formValue = this.registerForm.getRawValue();

      const { ownerName, email } = formValue;
      if (!ownerName || !email) return;

      if (this.groupId) {
        // Simple group registration
        this.authService
          .registerWithGroupID(email, ownerName, this.groupId)
          .pipe(
            tap(() => {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Registration completed! Please verify your email.',
                sticky: true 
              });
            })
          )
          .subscribe(() => this.router.navigate(['/auth/verify']));
        return;
      }

      // Type check for full form
      if (this.isFullFormValue(formValue)) {
        this.authService
          .registerFull(email, formValue.password, ownerName)
          .pipe(
            tap(() => {
              this.messageService.add({
                severity: 'info',
                summary: 'Info',
                detail: 'Registration completed! Please verify your email.',
                sticky: true,
              });
            })
          )
          .subscribe(() => this.router.navigate(['/auth/verify']));
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  private isFullFormValue(formValue: any): formValue is FullFormData {
    return 'password' in formValue && 'ownerName' in formValue;
  }
}
