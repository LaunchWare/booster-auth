export interface PasswordPolicyConfiguration {
  /**
   * Minimum password length
   * @default 8
   */
  minLength?: number

  /**
   * Maximum password length
   * @default 128
   */
  maxLength?: number

  /**
   * Require at least one uppercase letter
   * @default true
   */
  requireUppercase?: boolean

  /**
   * Require at least one lowercase letter
   * @default true
   */
  requireLowercase?: boolean

  /**
   * Require at least one number
   * @default true
   */
  requireNumbers?: boolean

  /**
   * Require at least one special character
   * @default false
   */
  requireSpecialChars?: boolean

  /**
   * Custom error messages for validation failures
   */
  messages?: {
    minLength?: string
    maxLength?: string
    requireUppercase?: string
    requireLowercase?: string
    requireNumbers?: string
    requireSpecialChars?: string
  }
}
