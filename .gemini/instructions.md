# Gemini CLI Instructions for BoosterAuth

Please read and follow the guidance in these files before working on any tasks:

1. `.ai/shared/architectural-context.md` - Core architectural principles and patterns
2. `.ai/shared/library-prd.md` - Project overview and development philosophy

## Key Principles

- All code lives in `libs/` as independently publishable npm packages
- `apps/` contains implementation examples only  
- TDD-first: Generate tests before implementations in `__tests__` directories
- Use TypeScript with strict mode, dependency injection, and Zod validation
- Follow security-first principles per Lucia auth patterns
- Respect architectural boundaries (no cross-dependencies without DI)
- Core services receive dependencies via constructor injection

## Commands

- `npx nx serve auth-backend-example` - Start development server
- `npx nx test <project-name>` - Run tests
- `npx nx lint <project-name>` - Lint code
- `npx nx typecheck <project-name>` - Type check
- `npx nx g @nx/node:lib <lib-name>` - Generate new library