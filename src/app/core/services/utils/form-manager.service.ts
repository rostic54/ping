import { Injectable, signal } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class FormManagerService {
  private readonly touchedFields = signal<Set<string>>(new Set<string>());

  validateField(control: AbstractControl): void {
    if (!control) return;
    
    // Only validate if the field has been touched
    if (control.touched) {
      control.updateValueAndValidity();
    }
  }

  getFormErrors(form: FormGroup): string[] {
    const errors: string[] = [];
    
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && this.touchedFields().has(key) && control.errors) {
        if (control.hasError('required')) {
          errors.push(`${key}: Обов'язкове поле`);
        }
        if (control.hasError('email')) {
          errors.push('Email: Введіть коректну email адресу');
        }
        if (control.hasError('minlength')) {
          errors.push(`${key}: Мінімальна довжина ${control.getError('minlength').requiredLength} символів`);
        }
        if (control.hasError('pattern')) {
          if (key === 'password') {
            errors.push('Пароль: Повинен містити великі та малі літери, цифри та спеціальні символи');
          } else {
            errors.push(`${key}: Некоректний формат`);
          }
        }
        if (control.hasError('passwordMismatch')) {
          errors.push('Паролі не співпадають');
        }
      }
    });
    
    return errors;
  }

  markFieldAsTouched(fieldName: string): void {
    this.touchedFields.update(fields => new Set(fields.add(fieldName)));
  }

  resetFieldValidation(fieldName: string): void {
    this.touchedFields.update(fields => {
      const newFields = new Set(fields);
      newFields.delete(fieldName);
      return newFields;
    });
  }

  
}

