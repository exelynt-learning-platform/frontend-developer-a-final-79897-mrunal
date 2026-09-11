import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  /**
   * Validates that the input is not just whitespace.
   */
  static noWhitespaceOnly(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const isWhitespace = String(control.value).trim().length === 0;
      return isWhitespace ? { whitespaceOnly: true } : null;
    };
  }

  /**
   * Validates mobile number: only digits, 7 to 15 numbers long.
   */
  static mobileNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const value = String(control.value).trim();
      // Allow only digits, length 7-15
      const valid = /^[0-9]{7,15}$/.test(value);
      return valid ? null : { invalidMobile: true };
    };
  }

  /**
   * Strict email validation.
   */
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      const value = String(control.value).trim();
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value) ? null : { invalidEmail: true };
    };
  }
}
