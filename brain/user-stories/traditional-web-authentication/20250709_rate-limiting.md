# User Story: Rate Limiting for Authentication

**Epic**: Traditional Web-Based Authentication  
**Story ID**: 20250709_rate-limiting  
**Priority**: High  
**Story Points**: 5  

## User Story
**As a** developer integrating BoosterAuth into my application  
**I want** configurable rate limiting across all authentication endpoints  
**So that** my application is protected from brute force attacks and abuse while maintaining good user experience

## Acceptance Criteria

### Functional Requirements
- [ ] **Configurable Limits**: Rate limits configurable per endpoint type (sign-up, sign-in, password reset)
- [ ] **Multiple Strategies**: Support IP-based, user-based, and global rate limiting
- [ ] **Transport Agnostic**: Works across tRPC, REST, and GraphQL implementations
- [ ] **Graceful Degradation**: Clear error messages with retry timing information
- [ ] **Bypass Mechanisms**: Allow whitelisting of trusted IPs or user agents
- [ ] **Sliding Window**: Implement sliding window algorithm for fair rate limiting

### Technical Requirements
- [ ] **Core Interface**: Define rate limiting interface in `@booster-auth/core`
- [ ] **Multiple Implementations**: Memory-based and Redis-based rate limiters
- [ ] **Middleware Integration**: Easy integration with tRPC, Express, and GraphQL
- [ ] **Configurable Storage**: Pluggable storage backends for rate limit data
- [ ] **Monitoring Support**: Metrics and logging for rate limit events
- [ ] **TypeScript**: Full type safety for all rate limiting configurations

### Security Requirements
- [ ] **Attack Prevention**: Prevent brute force attacks on authentication endpoints
- [ ] **DDoS Protection**: Protect against distributed denial of service attacks
- [ ] **Enumeration Protection**: Rate limit email validation to prevent user enumeration
- [ ] **Adaptive Limits**: Optionally increase limits for verified users
- [ ] **Audit Logging**: Log all rate limit violations with context

## Technical Implementation

### Package Structure
```no-highlight
libs/
├── rate-limiting/                 # Core rate limiting logic
│   └── src/
│       ├── interfaces/
│       │   ├── RateLimiter.ts
│       │   └── RateLimitStore.ts
│       ├── strategies/
│       │   ├── SlidingWindowLimiter.ts
│       │   └── TokenBucketLimiter.ts
│       ├── stores/
│       │   ├── MemoryRateLimitStore.ts
│       │   └── RedisRateLimitStore.ts
│       └── __tests__/
│           └── RateLimiter.test.ts
├── trpc/
│   └── rate-limiting/             # tRPC middleware
│       └── src/
│           ├── middleware/
│           │   └── rateLimitMiddleware.ts
│           └── __tests__/
│               └── rateLimitMiddleware.test.ts
├── express/
│   └── rate-limiting/             # Express middleware (future)
│       └── src/
│           ├── middleware/
│           │   └── rateLimitMiddleware.ts
│           └── __tests__/
│               └── rateLimitMiddleware.test.ts
└── graphql/
    └── rate-limiting/             # GraphQL middleware (future)
        └── src/
            ├── middleware/
            │   └── rateLimitMiddleware.ts
            └── __tests__/
                └── rateLimitMiddleware.test.ts
```

### Core Interfaces
```typescript
// @booster-auth/core
export interface RateLimiter {
  checkLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
  reset(key: string): Promise<void>;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  keyGenerator: (req: any) => string;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
}
```

### tRPC Implementation
```typescript
// @booster-auth/trpc/rate-limiting
import { TRPCError } from '@trpc/server';
import { RateLimiter, RateLimitConfig } from '@booster-auth/core';

export const createRateLimitMiddleware = (
  rateLimiter: RateLimiter,
  config: RateLimitConfig
) => {
  return async ({ ctx, next, type, path }) => {
    const key = config.keyGenerator(ctx);
    const result = await rateLimiter.checkLimit(
      key,
      config.maxAttempts,
      config.windowMs
    );

    if (!result.allowed) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: `Rate limit exceeded. Try again in ${result.retryAfter} seconds.`,
      });
    }

    // Add rate limit info to context
    ctx.rateLimitInfo = {
      remaining: result.remaining,
      resetTime: result.resetTime,
    };

    return next();
  };
};
```

### Usage Example
```typescript
// Example: Apply rate limiting to password auth router
import { createRateLimitMiddleware } from '@booster-auth/trpc/rate-limiting';
import { MemoryRateLimitStore } from '@booster-auth/rate-limiting';

const rateLimiter = new MemoryRateLimitStore();

const authRateLimitConfig = {
  maxAttempts: 5,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (ctx) => ctx.req.ip,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

const rateLimitMiddleware = createRateLimitMiddleware(rateLimiter, authRateLimitConfig);

export const passwordAuthRouter = router({
  signUp: publicProcedure
    .use(rateLimitMiddleware)
    .input(schemas.signUpInput)
    .mutation(async ({ input, ctx }) => {
      // Sign-up logic
    }),
});
```

## Data Flow
1. **Request Received**: Middleware intercepts request
2. **Key Generation**: Generate rate limit key (IP, user ID, etc.)
3. **Limit Check**: Check current usage against configured limits
4. **Decision**: Allow or reject request based on limits
5. **Response**: Return rate limit headers or error
6. **Cleanup**: Optional cleanup of expired rate limit data

## Error Scenarios
- [ ] **Rate Limit Exceeded**: Clear error with retry timing
- [ ] **Storage Failure**: Graceful fallback behavior
- [ ] **Configuration Error**: Validation of rate limit configurations
- [ ] **Key Generation Failure**: Fallback key generation strategies

## Definition of Done
- [ ] **Core Interfaces**: Rate limiting interfaces defined in core package
- [ ] **Memory Implementation**: In-memory rate limiter for development
- [ ] **Redis Implementation**: Redis-based rate limiter for production
- [ ] **tRPC Middleware**: Working middleware for tRPC procedures
- [ ] **Configuration**: Flexible configuration options
- [ ] **Testing**: Unit and integration tests with >90% coverage
- [ ] **Documentation**: Usage examples and configuration guide
- [ ] **Performance**: Rate limiting adds <10ms latency
- [ ] **Monitoring**: Metrics and logging for rate limit events

## Dependencies
- Redis (optional, for distributed rate limiting)
- tRPC server
- Logging framework
- Metrics collection system

## Notes
- This story focuses on tRPC implementation first
- REST and GraphQL implementations will follow similar patterns
- Storage backends are pluggable for different deployment scenarios
- Rate limiting is applied as middleware, not embedded in business logic
- Future enhancements: adaptive limits, machine learning-based detection

---
**Related Epic**: 20250709_traditional-web-authentication.md