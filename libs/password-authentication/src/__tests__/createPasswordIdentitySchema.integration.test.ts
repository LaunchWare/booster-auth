import { createPasswordIdentitySchema } from '../createPasswordIdentitySchema.js'
import { createPasswordPolicySchema } from '../password-policy/createPasswordPolicySchema.js'
import { z } from 'zod'

describe('createPasswordIdentitySchema', () => {
  describe('basic functionality', () => {
    it('creates schema with email identifier', () => {
      const schema = createPasswordIdentitySchema(['email'] as const)
      
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }
      
      expect(schema.safeParse(validData).success).toBe(true)
    })

    it('creates schema with username identifier', () => {
      const schema = createPasswordIdentitySchema(['username'] as const)
      
      const validData = {
        username: 'testuser',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }
      
      expect(schema.safeParse(validData).success).toBe(true)
    })

    it('creates schema with phone identifier', () => {
      const schema = createPasswordIdentitySchema(['phone'] as const)
      
      const validData = {
        phone: '+1234567890',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }
      
      expect(schema.safeParse(validData).success).toBe(true)
    })

    it('creates schema with multiple identifiers', () => {
      const schema = createPasswordIdentitySchema(['email', 'username'] as const)
      
      const validData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }
      
      expect(schema.safeParse(validData).success).toBe(true)
    })

    it('creates schema with all identifiers', () => {
      const schema = createPasswordIdentitySchema(['email', 'username', 'phone'] as const)
      
      const validData = {
        email: 'test@example.com',
        username: 'testuser',
        phone: '+1234567890',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }
      
      expect(schema.safeParse(validData).success).toBe(true)
    })
  })

  describe('default password policy', () => {
    it('enforces secure password defaults', () => {
      const schema = createPasswordIdentitySchema(['email'] as const)
      
      // Too short
      expect(schema.safeParse({
        email: 'test@example.com',
        password: 'Pass1',
        passwordConfirmation: 'Pass1',
      }).success).toBe(false)
      
      // Missing uppercase
      expect(schema.safeParse({
        email: 'test@example.com',
        password: 'password123',
        passwordConfirmation: 'password123',
      }).success).toBe(false)
      
      // Valid password
      expect(schema.safeParse({
        email: 'test@example.com',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(true)
    })
  })

  describe('custom schemas', () => {
    it('accepts custom email schema', () => {
      const customEmailSchema = z.string().email().refine(
        email => email.endsWith('@company.com'),
        { message: 'Must be a company email' }
      )
      
      const schema = createPasswordIdentitySchema(['email'] as const, {
        email: customEmailSchema,
      })
      
      expect(schema.safeParse({
        email: 'test@gmail.com',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(false)
      
      expect(schema.safeParse({
        email: 'test@company.com',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(true)
    })

    it('accepts custom username schema', () => {
      const customUsernameSchema = z.string().min(5).max(15).regex(/^[a-zA-Z0-9_]+$/)
      
      const schema = createPasswordIdentitySchema(['username'] as const, {
        username: customUsernameSchema,
      })
      
      expect(schema.safeParse({
        username: 'ab',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(false) // Too short
      
      expect(schema.safeParse({
        username: 'valid_user123',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(true)
    })

    it('accepts custom phone schema', () => {
      const customPhoneSchema = z.string().regex(/^\+1[0-9]{10}$/, {
        message: 'Must be US phone number with +1',
      })
      
      const schema = createPasswordIdentitySchema(['phone'] as const, {
        phone: customPhoneSchema,
      })
      
      expect(schema.safeParse({
        phone: '+44123456789',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(false) // UK number
      
      expect(schema.safeParse({
        phone: '+11234567890',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(true)
    })

    it('accepts custom password schema', () => {
      const customPasswordSchema = z.string().min(6).max(12)
      
      const schema = createPasswordIdentitySchema(['email'] as const, {
        password: customPasswordSchema,
      })
      
      expect(schema.safeParse({
        email: 'test@example.com',
        password: 'short',
        passwordConfirmation: 'short',
      }).success).toBe(false) // Too short
      
      expect(schema.safeParse({
        email: 'test@example.com',
        password: 'verylongpassword',
        passwordConfirmation: 'verylongpassword',
      }).success).toBe(false) // Too long
      
      expect(schema.safeParse({
        email: 'test@example.com',
        password: 'goodpass',
        passwordConfirmation: 'goodpass',
      }).success).toBe(true)
    })
  })

  describe('validation behavior', () => {
    it('validates email format by default', () => {
      const schema = createPasswordIdentitySchema(['email'] as const)
      
      expect(schema.safeParse({
        email: 'invalid-email',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(false)
      
      expect(schema.safeParse({
        email: 'valid@example.com',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(true)
    })

    it('validates phone format by default', () => {
      const schema = createPasswordIdentitySchema(['phone'] as const)
      
      expect(schema.safeParse({
        phone: 'not-a-phone',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(false)
      
      expect(schema.safeParse({
        phone: '+1234567890',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(true)
    })

    it('requires all specified identifiers', () => {
      const schema = createPasswordIdentitySchema(['email', 'username'] as const)
      
      // Missing username
      expect(schema.safeParse({
        email: 'test@example.com',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(false)
      
      // Missing email
      expect(schema.safeParse({
        username: 'testuser',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(false)
      
      // Both present
      expect(schema.safeParse({
        email: 'test@example.com',
        username: 'testuser',
        password: 'Password123',
        passwordConfirmation: 'Password123',
      }).success).toBe(true)
    })

    it('always requires password and passwordConfirmation', () => {
      const schema = createPasswordIdentitySchema(['email'] as const)
      
      // Missing password
      expect(schema.safeParse({
        email: 'test@example.com',
        passwordConfirmation: 'Password123',
      }).success).toBe(false)
      
      // Missing passwordConfirmation
      expect(schema.safeParse({
        email: 'test@example.com',
        password: 'Password123',
      }).success).toBe(false)
    })
  })
})