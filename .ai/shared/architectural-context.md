# Architectural Context: Booster Auth

This monorepo contains a suite of npm packages focused solely on implementing modular, secure, and extensible authentication systems for NodeJS / React applications. The packages are designed to be used independently or together, allowing developers to choose the components that best fit their needs.

This monorepo contains a suite of npm packages focused solely on implementing modular, secure, and extensible authentication systems for SaaS applications.

## 🧱 Monorepo Philosophy

- **All code lives in `libs/`** as independently publishable npm packages.
- **`apps/` contains implementation examples only**, such as an Express or React app consuming the auth packages.
- **The system is AI-first**: Claude and Gemini CLI agents are used to scaffold, test, and iterate on new features.

## AI Philosophy

This repository treats AI prompts and context as code. The AI agents are expected to:

- Propose clean, minimal TypeScript implementations using dependency injection (DI).
- Generate tests for every public function or class.
- Avoid implementation in `core` packages (interfaces only).
- Avoid tight coupling to Prisma in core logic.
- Use Zod for schema validation.
- Respect architectural boundaries (e.g., no cross-dependencies without DI).
- Record important context in the `.ai/` directory, including architectural decisions, system prompts, and AI assistant agents and rules.

## 🔐 Security Principles

- Follows [Lucia](https://lucia-auth.com/) principles: no opaque abstractions, explicit session control, security-first.
- Sessions are stored securely and validated on every request.
- Passwords are hashed using a configurable `PasswordHasher` (default: bcrypt).
- OAuth and SSO providers may be added via pluggable strategies.
- Consider alternative authentication methods such as JWT, magic links, and passkeys.

## 🧪 Testing Philosophy

- TDD-first: tests must be generated before implementations.
- Unit tests are located contextually in `__tests__` subdirectories with a suffix that indicates they are explicitly test files. (`*.test.ts`).
- Each library is independently testable.
- End-to-end tests are planned with Playwright via example `apps/`.
- test runs should take advantage of Nx's caching, affected, and parallelization capabilities.

## 🧠 Agent Expectations

Claude, Gemini, or other agents should:

- Propose clean, minimal TypeScript implementations using DI
- Generate tests for every public function or class
- Avoid implementation in `core` packages (interfaces only)
- Avoid tight coupling to Prisma in core logic
- Use Zod for schema validation
- Respect architectural boundaries (e.g., no cross-dependencies without DI)

## ⚙️ Tooling & Platform Defaults

With the exception of typescript, all tooling suggested below is the **default** for the monorepo. You may override these defaults, but do so consistently with the architectural context.

- Language: TypeScript (`strict` mode)
- Package Manager: pnpm
- Monorepo: Nx
- Linting: ESLint (flat config via internal libraries)
- Backend: Express + tRPC
- ORM: Prisma (PostgreSQL preferred)
- Validation: Zod
- Default deployment targets: AWS ECS Fargate (server), CloudFront (client)

## 🔌 DI & Extensibility

- Core services (`SessionService`, `IdentityService`) receive dependencies via constructor injection.
