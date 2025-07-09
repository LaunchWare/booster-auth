export interface IdentityValidator {
  // Method to validate an identity
  // This could involve checking format, uniqueness, etc.
  // eslint-disable-next-line no-unused-vars
  validate(_identity: any): Promise<ValidationResult>;
}

// Placeholder for ValidationResult until it's defined elsewhere
import { ValidationResult } from '../types/ValidationResult.js';
