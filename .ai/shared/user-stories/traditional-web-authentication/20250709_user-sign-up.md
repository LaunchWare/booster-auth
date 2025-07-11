# User Story: User Sign Up

**Epic**: Traditional Web-Based Authentication
**Story ID**: 20250709_user-sign-up
**Priority**: High
**Story Points**: 8

## User Story

**As a** developer building a SaaS application
**I want** to integrate secure password-based user registration in under 5 minutes
**So that** I can ship authentication to production quickly while maintaining enterprise-grade security and compliance readiness

## Acceptance Criteria

### Functional Requirements

- [ ] **Email Validation**: System validates email format and uniqueness
- [ ] **Password Requirements**: Configurable password policy (length, complexity)
- [ ] **Account Creation**: New user account stored securely in database
- [ ] **Password Security**: Password hashed with bcrypt before storage
- [ ] **Error Handling**: Clear, non-enumerable error messages
- [ ] **Input Sanitization**: All inputs validated and sanitized. Emails are not case-sensitive by default, but this is configurable.

### Technical Requirements

- [ ] **Zod Schema**: Email and password validation using Zod schemas
- [ ] **TypeScript**: Full type safety for all interfaces
- [ ] **Dependency Injection**: Services receive dependencies via constructor
- [ ] **Database Abstraction**: No tight coupling to Prisma in core logic. Use Drizzle for contrast
- [ ] **Independent Testing**: Unit tests in `__tests__` directories
- [ ] **Package Structure**: Core interfaces separate from implementations

### Security Requirements

- [ ] **Password Hashing**: bcrypt with configurable rounds (default: 12, minimum: 10)
- [ ] **Enumeration Protection**: Generic responses that don't reveal account existence
- [ ] **Input Validation**: Prevent injection attacks and malformed data
- [ ] **Timing Attack Protection**: Consistent response times
- [ ] **No Plaintext Storage**: Passwords never stored in plaintext

## Technical Implementation

### Package Structure

```no-highlight
libs/
├── core/                          # Core interfaces for identity validation
│   └── src/
│       ├── interfaces/
│       │   ├── IdentityValidation.ts
│       │   └── UserValidation.ts
│       └── types/
│           ├── Identity.ts
│           ├── User.ts
│           └── ValidationResult.ts
├── password-auth/                 # Password-based authentication
│   └── src/
│       ├── identity/
│       │   └── PasswordIdentity.ts
│       ├── interfaces/
│       │   └── PasswordIdentityRepository.ts
│       ├── services/
│       │   └── PasswordAuthenticationService.ts
│       ├── schemas/
│       │   └── passwordAuthenticationSchemas.ts
│       └── __tests__/
│           ├── PasswordIdentity.test.ts
│           └── PasswordAuthenticationService.test.ts
├── password-policy/               # Password policy validation
│   └── src/
│       ├── schemas/
│       │   └── passwordPolicySchema.ts
│       ├── services/
│       │   └── PasswordPolicyService.ts
│       └── __tests__/
│           └── PasswordPolicyService.test.ts
├── trpc/                          # tRPC route implementations
│   └── password-auth/             # tRPC routes for password auth
│       └── src/
│           ├── passwordAuthenticationRouter.ts
│           └── __tests__/
│               └── passwordAuthenticationRouter.test.ts
└── prisma/                        # Prisma implementations
    └── password-auth/             # Prisma implementation for password auth
        └── src/
            ├── repositories/
            │   └── PrismaPasswordIdentityRepository.ts
            └── __tests__/
                └── PrismaPasswordIdentityRepository.test.ts
```

### Core Interfaces

```typescript
// @booster-auth/core
export interface PasswordIdentityService {
  signUp(request: PasswordSignUpRequest): Promise<PasswordSignUpResult>;
}

export interface PasswordHashing {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}

export interface EmailValidation {
  validate(email: string): Promise<ValidationResult>; // Encapsulates format + uniqueness
}

export interface PasswordValidation {
  validate(password: string, passwordConfirmation: string): ValidationResult; // Encapsulates policy + confirmation
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(userData: CreatePasswordUserData): Promise<User>;
}
```

### Core Types (Primitive Properties Only)

```typescript
// @booster-auth/core
export interface PasswordSignUpRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface CreatePasswordUserData {
  email: string;
  passwordHash: string;
  createdAt: string; // ISO string
}

export interface User {
  id: string;
  email: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordSignUpResult {
  success: boolean;
  userId?: string;
  error?: string;
}
```

### Password Policy Library

```typescript
// @booster-auth/password-policy
import { z } from 'zod';

export type PasswordSchema = z.ZodString;

// Default password schema - can be overridden
export const defaultPasswordSchema: PasswordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Example alternative schemas
export const strictPasswordSchema: PasswordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password must be no more than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

export const simplePasswordSchema: PasswordSchema = z.string()
  .min(6, 'Password must be at least 6 characters');
```

### Shared Authentication Schemas

```typescript
// @booster-auth/password-auth/schemas
import { z } from 'zod';
import { defaultPasswordSchema, PasswordSchema } from '@booster-auth/password-policy';

export const createPasswordAuthSchemas = (passwordSchema: PasswordSchema = defaultPasswordSchema) => {
  const signUpInputSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: passwordSchema,
    passwordConfirmation: z.string(),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

  const signUpOutputSchema = z.object({
    success: z.boolean(),
    userId: z.string().optional(),
    error: z.string().optional(),
  });

  return {
    signUpInput: signUpInputSchema,
    signUpOutput: signUpOutputSchema,
  };
};
```

### tRPC Router Implementation

```typescript
// @booster-auth/trpc/password-auth
import { router, publicProcedure } from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { createPasswordAuthSchemas } from '@booster-auth/password-auth/schemas';
import { defaultPasswordSchema, PasswordSchema } from '@booster-auth/password-policy';

export const createPasswordAuthRouter = (passwordSchema: PasswordSchema = defaultPasswordSchema) => {
  const schemas = createPasswordAuthSchemas(passwordSchema);

  return router({
    signUp: publicProcedure
      .input(schemas.signUpInput)
      .output(schemas.signUpOutput)
      .mutation(async ({ input, ctx }) => {
        const passwordAuthService = ctx.passwordAuthService;

        const result = await passwordAuthService.signUp(input);

        if (!result.success) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: result.error || 'Sign up failed',
          });
        }

        return result;
      }),
  });
};

// Usage examples
const customPasswordSchema = z.string()
  .min(10)
  .refine((password) => !password.includes('password'), {
    message: 'Password cannot contain the word "password"',
  });

export const customPasswordAuthRouter = createPasswordAuthRouter(customPasswordSchema);
```

### Architectural Considerations

- **No Java Conventions**: Avoid "I" prefix for interfaces - types should be intuitively expressive
- **TypeScript Native**: Use TypeScript conventions and patterns
- **Granular Interfaces**: Each interface has a single, focused responsibility
- **Separation of Concerns**: Validation, storage, and business logic are separate packages
- **Dependency Injection**: Constructor injection without framework-specific annotations
- **Package Boundaries**: Clear separation between core interfaces and implementations

### Data Flow

1. **Email Validation**: EmailValidator validates format and uniqueness
2. **Password Validation**: PasswordValidator validates policy and confirmation match
3. **Password Hashing**: PasswordHasher hashes password securely
4. **Account Creation**: UserRepository creates new user record
5. **Response**: Generic success/failure response

### Error Scenarios

- [ ] **Invalid Email Format/Duplicate**: Validation error from EmailValidator
- [ ] **Weak Password/Mismatch**: Password policy or confirmation error from PasswordValidator
- [ ] **Database Error**: Generic system error (no details leaked)
- [ ] **Concurrent Registration**: Handle duplicate email race conditions gracefully

## Definition of Done

- [ ] **Core Interfaces**: Defined in `@booster-auth/core` package
- [ ] **Implementation**: Working `IdentityService` with dependency injection
- [ ] **Password Hashing**: Secure bcrypt implementation
- [ ] **Validation**: Separate email and password validators
- [ ] **Storage**: Database abstraction layer
- [ ] **Unit Tests**: >90% coverage for all components
- [ ] **Integration Tests**: End-to-end sign-up flow
- [ ] **Security Review**: All security criteria met
- [ ] **Documentation**: API documentation and usage examples
- [ ] **Performance**: Sign-up completes within 2 seconds
- [ ] **Example App**: Working example in `apps/` directory

## Dependencies

- **Database**: User storage capability
- **Validation**: Zod for schema validation
- **Hashing**: bcrypt for password security
- **Testing**: Jest for unit/integration tests

## Risks & Mitigation

- **Risk**: Password policy too restrictive
- **Mitigation**: Make password requirements configurable

- **Risk**: Database performance issues
- **Mitigation**: Efficient queries, proper indexing

- **Risk**: Enumeration attacks
- **Mitigation**: Generic error messages, consistent timing

## Notes

### **Current Scope**
- This story focuses on core sign-up functionality with tRPC integration
- Email verification will be addressed in separate story
- Session creation after sign-up is handled by sign-in flow
- Password reset functionality is separate epic requirement
- **Rate limiting** is handled in separate user story (20250709_rate-limiting.md)

### **Business Impact**
- **Developer Productivity**: 5-minute integration saves 2-3 days of auth implementation
- **Security Posture**: Enterprise-grade security reduces compliance risk
- **Time-to-Market**: Faster auth implementation accelerates product launches

### **Technical Decisions**
- tRPC router is designed to be mountable to existing applications
- Future support for REST and GraphQL will follow similar patterns
- Business logic remains transport-agnostic for maximum flexibility
- Rate limiting applied as middleware (see separate story)

---
**Related Epic**: 20250709_traditional-web-authentication.md
