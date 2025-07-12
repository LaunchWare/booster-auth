import { z } from 'zod';

export type IdentifierType = 'email' | 'username' | 'phone';
export type IdentifierArray = readonly IdentifierType[];

// Schema builder with compile-time knowledge
export const createPasswordIdentitySchema = <T extends IdentifierArray>(
  identifiers: T,
  schema?: {
    email?: z.ZodString;
    username?: z.ZodString;
    phone?: z.ZodString;
  }
) => {
  const base = z.object({
    password: z.string(),
    passwordConfirmation: z.string(),
  });

  const hasEmail = identifiers.includes('email');
  const hasUsername = identifiers.includes('username');
  const hasPhone = identifiers.includes('phone');

  return base.extend({
    ...(hasEmail && { email: schema?.email || z.string().email() }),
    ...(hasUsername && { username: schema?.username || z.string() }),
    ...(hasPhone && { phone: schema?.phone || z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' }) }),
  });
};
