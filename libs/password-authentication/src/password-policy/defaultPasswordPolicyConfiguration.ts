import { PasswordPolicyConfiguration } from './PasswordPolicyConfiguration.js'

export const defaultPasswordPolicyConfiguration: Required<Omit<PasswordPolicyConfiguration, 'messages'>> & {
  messages: Required<NonNullable<PasswordPolicyConfiguration['messages']>>
} = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  messages: {
    minLength: 'Password must be at least {minLength} characters long',
    maxLength: 'Password must be no more than {maxLength} characters long',
    requireUppercase: 'Password must contain at least one uppercase letter',
    requireLowercase: 'Password must contain at least one lowercase letter',
    requireNumbers: 'Password must contain at least one number',
    requireSpecialChars: 'Password must contain at least one special character',
  },
}
