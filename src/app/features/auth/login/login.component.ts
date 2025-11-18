import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

import { AuthService } from '../../../core/services/auth.service';
import { tap } from 'rxjs';
import { FloatLabel } from 'primeng/floatlabel';

interface BaseFormModel {
  password: FormControl<string>;
  email: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    FloatLabel,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  showErrors(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  onFieldBlur(fieldName: keyof BaseFormModel): void {
    const control = this.loginForm.get(fieldName);
    control?.markAsTouched();
    // this.formState.set(this.getValidationKeys(this.registerForm));
  }

  onFieldFocus(fieldName: keyof BaseFormModel): void {
    const control = this.loginForm.get(fieldName);
    control?.markAsUntouched();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const { email, password } = this.loginForm.value;
        this.authService
          .login(email, password)
          .pipe(tap(() => this.router.navigate(['/home'])))
          .subscribe();
      } catch (error) {
        console.error('Login error:', error);
        // TODO: Add the error handler
      } finally {
        this.isLoading = false;
      }
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
