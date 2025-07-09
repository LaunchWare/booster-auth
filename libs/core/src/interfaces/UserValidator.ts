export interface UserValidator {
  // Method to validate a user object
  // This could involve checking properties, consistency, etc.
  // eslint-disable-next-line no-unused-vars
  validate(_user: any): Promise<ValidationResult>;
}

// Placeholder for ValidationResult until it's defined elsewhere
import { ValidationResult } from '../types/ValidationResult.js';
