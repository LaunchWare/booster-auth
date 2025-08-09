import { createPasswordPolicySchema } from '../createPasswordPolicySchema.js'
import { z } from 'zod'

describe('createPasswordPolicySchema', () => {
  describe('with default configuration', () => {
    it('creates schema with secure defaults', () => {
      const schema = createPasswordPolicySchema()
      
      // Valid password meeting all default requirements
      expect(schema.safeParse('Password123').success).toBe(true)
      
      // Too short (< 8 characters)
      expect(schema.safeParse('Pass1').success).toBe(false)
      
      // Missing uppercase
      expect(schema.safeParse('password123').success).toBe(false)
      
      // Missing lowercase
      expect(schema.safeParse('PASSWORD123').success).toBe(false)
      
      // Missing number
      expect(schema.safeParse('Password').success).toBe(false)
    })

    it('does not require special characters by default', () => {
      const schema = createPasswordPolicySchema()
      
      expect(schema.safeParse('Password123').success).toBe(true)
    })

    it('enforces maximum length', () => {
      const schema = createPasswordPolicySchema()
      const longPassword = 'P'.repeat(129) + 'a1' // 131 characters
      
      expect(schema.safeParse(longPassword).success).toBe(false)
    })
  })

  describe('with custom configuration', () => {
    it('respects custom minimum length', () => {
      const schema = createPasswordPolicySchema({ minLength: 12 })
      
      expect(schema.safeParse('Password123').success).toBe(false) // 11 chars
      expect(schema.safeParse('Password1234').success).toBe(true) // 12 chars
    })

    it('respects custom maximum length', () => {
      const schema = createPasswordPolicySchema({ maxLength: 10 })
      
      expect(schema.safeParse('Password12').success).toBe(true) // 10 chars
      expect(schema.safeParse('Password123').success).toBe(false) // 11 chars
    })

    it('allows disabling uppercase requirement', () => {
      const schema = createPasswordPolicySchema({ requireUppercase: false })
      
      expect(schema.safeParse('password123').success).toBe(true)
    })

    it('allows disabling lowercase requirement', () => {
      const schema = createPasswordPolicySchema({ requireLowercase: false })
      
      expect(schema.safeParse('PASSWORD123').success).toBe(true)
    })

    it('allows disabling number requirement', () => {
      const schema = createPasswordPolicySchema({ requireNumbers: false })
      
      expect(schema.safeParse('Password').success).toBe(true)
    })

    it('enforces special character requirement when enabled', () => {
      const schema = createPasswordPolicySchema({ requireSpecialChars: true })
      
      expect(schema.safeParse('Password123').success).toBe(false)
      expect(schema.safeParse('Password123!').success).toBe(true)
      expect(schema.safeParse('Password123@').success).toBe(true)
      expect(schema.safeParse('Password123#').success).toBe(true)
    })

    it('supports relaxed configuration', () => {
      const schema = createPasswordPolicySchema({
        minLength: 6,
        requireUppercase: false,
        requireNumbers: false,
      })
      
      expect(schema.safeParse('password').success).toBe(true)
    })

    it('supports strict configuration', () => {
      const schema = createPasswordPolicySchema({
        minLength: 12,
        requireSpecialChars: true,
      })
      
      expect(schema.safeParse('Password123!').success).toBe(true)
      expect(schema.safeParse('Password123').success).toBe(false) // No special char
      expect(schema.safeParse('Password12!').success).toBe(false) // Too short
    })
  })

  describe('custom error messages', () => {
    it('uses custom error messages', () => {
      const schema = createPasswordPolicySchema({
        minLength: 10,
        messages: {
          minLength: 'Must be at least 10 characters',
          requireUppercase: 'Needs uppercase letter',
        },
      })
      
      const result = schema.safeParse('short')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Must be at least 10 characters')
      }
      
      const result2 = schema.safeParse('lowercase123')
      expect(result2.success).toBe(false)
      if (!result2.success) {
        const uppercaseError = result2.error.issues.find(issue => 
          issue.message === 'Needs uppercase letter'
        )
        expect(uppercaseError).toBeDefined()
      }
    })

    it('interpolates values in default messages', () => {
      const schema = createPasswordPolicySchema({ minLength: 15, maxLength: 20 })
      
      const shortResult = schema.safeParse('short')
      expect(shortResult.success).toBe(false)
      if (!shortResult.success) {
        expect(shortResult.error.issues[0].message).toBe('Password must be at least 15 characters long')
      }
      
      const longResult = schema.safeParse('a'.repeat(25))
      expect(longResult.success).toBe(false)
      if (!longResult.success) {
        expect(longResult.error.issues[0].message).toBe('Password must be no more than 20 characters long')
      }
    })
  })

  describe('edge cases', () => {
    it('handles empty configuration object', () => {
      const schema = createPasswordPolicySchema({})
      
      expect(schema.safeParse('Password123').success).toBe(true)
    })

    it('handles partial message overrides', () => {
      const schema = createPasswordPolicySchema({
        messages: {
          minLength: 'Custom min length message',
        },
      })
      
      const result = schema.safeParse('short')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Custom min length message')
      }
    })

    it('returns a ZodString type', () => {
      const schema = createPasswordPolicySchema()
      expect(schema).toBeInstanceOf(z.ZodString)
    })
  })
})