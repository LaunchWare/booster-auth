import z from 'zod'
import { createPasswordIdentitySchema } from '../createPasswordIdentitySchema.js'

describe('createPasswordIdentitySchema', () => {
  describe('email only', () => {
    it('defines an email property', () => {
      const schema = createPasswordIdentitySchema(['email'])
      expect(schema.shape).toHaveProperty('email')
      expect(schema.shape.email).toBeDefined()
    })

    it('does not define a username property', () => {
      const schema = createPasswordIdentitySchema(['email'])
      expect(schema.shape).not.toHaveProperty('username')
    })
  })

  describe('username only', () => {
    it('defines a username property', () => {
      const schema = createPasswordIdentitySchema(['username'])
      expect(schema.shape).toHaveProperty('username')
      expect(schema.shape.username).toBeDefined()
    })

    it('does not define an email property', () => {
      const schema = createPasswordIdentitySchema(['username'])
      expect(schema.shape).not.toHaveProperty('email')
    })
  })

  describe('phone only', () => {
    it('defines a phone property', () => {
      const schema = createPasswordIdentitySchema(['phone'])
      expect(schema.shape).toHaveProperty('phone')
      expect(schema.shape.phone).toBeDefined()
    })

    it('does not define email or username properties', () => {
      const schema = createPasswordIdentitySchema(['phone'])
      expect(schema.shape).not.toHaveProperty('email')
      expect(schema.shape).not.toHaveProperty('username')
    })
  })

  describe('multiple identifiers', () => {
    it('defines both email and username properties', () => {
      const schema = createPasswordIdentitySchema(['email', 'username'])
      expect(schema.shape).toHaveProperty('email')
      expect(schema.shape.email).toBeDefined()
      expect(schema.shape).toHaveProperty('username')
      expect(schema.shape.username).toBeDefined()
    })

    it('defines email and phone properties', () => {
      const schema = createPasswordIdentitySchema(['email', 'phone'])
      expect(schema.shape).toHaveProperty('email')
      expect(schema.shape).toHaveProperty('phone')
      expect(schema.shape).not.toHaveProperty('username')
    })

    it('defines all three identifier properties', () => {
      const schema = createPasswordIdentitySchema(['email', 'username', 'phone'])
      expect(schema.shape).toHaveProperty('email')
      expect(schema.shape).toHaveProperty('username')
      expect(schema.shape).toHaveProperty('phone')
    })
  })

  describe('with custom schemas', () => {
    it('uses custom email schema if provided', () => {
      const customEmailSchema = { email: z.string().min(5) }
      const schema = createPasswordIdentitySchema(['email'], customEmailSchema)
      expect(schema.shape.email).toEqual(customEmailSchema.email)
    })

    it('uses custom username schema if provided', () => {
      const customUsernameSchema = { username: z.string().min(3) }
      const schema = createPasswordIdentitySchema(['username'], customUsernameSchema)
      expect(schema.shape.username).toEqual(customUsernameSchema.username)
    })

    it('uses custom phone schema if provided', () => {
      const customPhoneSchema = { phone: z.string().min(10) }
      const schema = createPasswordIdentitySchema(['phone'], customPhoneSchema)
      expect(schema.shape.phone).toEqual(customPhoneSchema.phone)
    })

    it('uses multiple custom schemas', () => {
      const customSchemas = {
        email: z.string().min(5),
        phone: z.string().min(10),
        username: z.string().min(3)
      }
      const schema = createPasswordIdentitySchema(['email', 'phone', 'username'], customSchemas)
      expect(schema.shape.email).toEqual(customSchemas.email)
      expect(schema.shape.phone).toEqual(customSchemas.phone)
      expect(schema.shape.username).toEqual(customSchemas.username)
    })
  })
})
