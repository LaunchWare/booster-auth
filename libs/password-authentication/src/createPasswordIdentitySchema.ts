import { z } from 'zod'
import { defaultPhoneNumberRegex } from './defaultPhoneNumberRegex.js'
import { createPasswordPolicySchema } from './password-policy/createPasswordPolicySchema.js'
import { defaultPasswordPolicyConfiguration } from './password-policy/defaultPasswordPolicyConfiguration.js'

export type IdentifierType = 'email' | 'username' | 'phone'
export type IdentifierArray = readonly IdentifierType[]

export function createPasswordIdentitySchema<T extends IdentifierArray>(
  identifiers: T,
  schema?: {
    email?: z.ZodString
    username?: z.ZodString
    phone?: z.ZodString
    password?: z.ZodString
  }
) {
  const passwordSchema = schema?.password || createPasswordPolicySchema(defaultPasswordPolicyConfiguration)

  const base = z.object({
    password: passwordSchema,
    passwordConfirmation: z.string(),
  })

  const hasEmail = identifiers.includes('email')
  const hasUsername = identifiers.includes('username')
  const hasPhone = identifiers.includes('phone')

  return base.extend({
    ...(hasEmail && { email: schema?.email || z.email() }),
    ...(hasUsername && { username: schema?.username || z.string() }),
    ...(hasPhone && {
      phone: schema?.phone || z.string().regex(defaultPhoneNumberRegex, { message: 'Invalid phone number' }),
    }),
  })
}
