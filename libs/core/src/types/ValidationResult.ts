// Represents the result of a validation operation.
// Used by IdentityValidator and UserValidator, and potentially other validators.
export interface ValidationResult {
  isValid: boolean; // True if validation passed, false otherwise
  error?: string;   // Optional error message if validation failed.
                    // Should be a non-enumerable, generic message for security reasons
                    // in contexts like user sign-up to prevent account enumeration.
}
