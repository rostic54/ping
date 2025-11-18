import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { of } from 'rxjs/internal/observable/of';

/**
 * Custom validator function factory.
 * Compares the current value of a FormArray or FormGroup against a stored
 * original value to determine if any *meaningful* changes have occurred.
 * * @param originalValue The data loaded from the server (baseline). Stringify before.
 * @returns A ValidatorFn that checks for equality.
 */
export function hasUnchangedValue(originalValue: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentValue = control.value;
    const isSame = JSON.stringify(currentValue) === originalValue;

    if (isSame) {
      return of({ unchanged: true });
    }

    return of(null);
  };
}