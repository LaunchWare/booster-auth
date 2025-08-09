import { z } from 'zod'
import type { PasswordPolicyConfiguration } from './PasswordPolicyConfiguration.js'
import { defaultPasswordPolicyConfiguration } from './defaultPasswordPolicyConfiguration.js'

/**
 * Creates a Zod password schema based on the provided policy configuration.
 *
 * @param config - Password policy configuration
 * @returns Zod string schema with password validation rules
 */
export function createPasswordPolicySchema(config: PasswordPolicyConfiguration = {}): z.ZodString {
  const mergedConfig = {
    ...defaultPasswordPolicyConfiguration,
    ...config,
    messages: {
      ...defaultPasswordPolicyConfiguration.messages,
      ...config.messages,
    },
  }

  let schema = z.string()

  // Apply length constraints
  schema = schema.min(
    mergedConfig.minLength,
    mergedConfig.messages.minLength.replace('{minLength}', mergedConfig.minLength.toString())
  )

  schema = schema.max(
    mergedConfig.maxLength,
    mergedConfig.messages.maxLength.replace('{maxLength}', mergedConfig.maxLength.toString())
  )

  if (mergedConfig.requireUppercase) {
    schema = schema.regex(/[A-Z]/, mergedConfig.messages.requireUppercase)
  }

  if (mergedConfig.requireLowercase) {
    schema = schema.regex(/[a-z]/, mergedConfig.messages.requireLowercase)
  }

  if (mergedConfig.requireNumbers) {
    schema = schema.regex(/[0-9]/, mergedConfig.messages.requireNumbers)
  }

  if (mergedConfig.requireSpecialChars) {
    schema = schema.regex(/[!@#$%^&*(),.?":{}|<>]/, mergedConfig.messages.requireSpecialChars)
  }

  return schema
}
