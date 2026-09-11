import { FormControl } from '@angular/forms';
import { CustomValidators } from './custom-validators';

describe('CustomValidators', () => {
  describe('noWhitespaceOnly', () => {
    const validator = CustomValidators.noWhitespaceOnly();

    it('should return null for empty or null value', () => {
      expect(validator(new FormControl(''))).toBeNull();
      expect(validator(new FormControl(null))).toBeNull();
    });

    it('should return error if value contains only whitespace', () => {
      expect(validator(new FormControl('   '))).toEqual({ whitespaceOnly: true });
      expect(validator(new FormControl('  \t  '))).toEqual({ whitespaceOnly: true });
    });

    it('should return null for valid non-whitespace text', () => {
      expect(validator(new FormControl('Rahul'))).toBeNull();
      expect(validator(new FormControl(' Rahul Sharma '))).toBeNull();
    });
  });

  describe('mobileNumber', () => {
    const validator = CustomValidators.mobileNumber();

    it('should return null for empty value', () => {
      expect(validator(new FormControl(''))).toBeNull();
    });

    it('should return null for valid 10-digit number', () => {
      expect(validator(new FormControl('9876543210'))).toBeNull();
    });

    it('should return error for invalid characters', () => {
      expect(validator(new FormControl('98765abcde'))).toEqual({ invalidMobile: true });
      expect(validator(new FormControl('+919876543210'))).toEqual({ invalidMobile: true });
    });

    it('should return error for number too short or too long', () => {
      expect(validator(new FormControl('12345'))).toEqual({ invalidMobile: true });
      expect(validator(new FormControl('1234567890123456'))).toEqual({ invalidMobile: true });
    });
  });

  describe('email', () => {
    const validator = CustomValidators.email();

    it('should return null for empty value', () => {
      expect(validator(new FormControl(''))).toBeNull();
    });

    it('should return null for valid email address', () => {
      expect(validator(new FormControl('user@example.com'))).toBeNull();
      expect(validator(new FormControl('john.doe@domain.co.in'))).toBeNull();
    });

    it('should return error for invalid email formats', () => {
      expect(validator(new FormControl('not-an-email'))).toEqual({ invalidEmail: true });
      expect(validator(new FormControl('user@'))).toEqual({ invalidEmail: true });
      expect(validator(new FormControl('@example.com'))).toEqual({ invalidEmail: true });
      expect(validator(new FormControl('user@domain'))).toEqual({ invalidEmail: true });
    });
  });
});
