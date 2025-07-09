# Booster Auth Library

This monorepo contains a suite of npm packages focused solely on implementing modular, secure, and extensible authentication systems for SaaS applications.

## Key Features

- **Modular Design**: Each package is independently publishable and can be used in isolation or together.
- **Security First**: Follows best practices for secure authentication, including session management and password hashing.
- **Extensible**: Easily add new authentication methods or providers through pluggable strategies.
- **Embrace Open Standards**: Supports OAuth, OIDC, SAML, and other common authentication protocols.
- **AI-First Development**: Utilizes AI agents for code generation, testing, PR review, and refactoring.
- **TDD Approach**: Tests are generated before implementations, ensuring high code quality and reliability.
- **TypeScript**: Built with TypeScript for type safety and developer experience.

## Development Philosophy

- **Convention over Configuration**: Provides sensible defaults while allowing customization.
- **Semantic Versioning**: Follows semantic versioning for all packages to ensure compatibility and stability.
- **Test-Driven Development**: All features are developed with tests first, ensuring reliability and maintainability.
- **AI-Assisted Development**: Leverages AI tools for code generation, testing, and refactoring to enhance productivity and code quality.
- **Security as a Priority**: Implements security best practices from the ground up, ensuring that authentication systems are robust and secure.
- **Extensible Architecture**: Designed to be easily extended with new authentication methods, providers, and features.
- **Modular Packages**: Each package serves a specific purpose, allowing developers to pick and choose components as needed.
- **Documentation-Driven**: Comprehensive documentation is provided for each package, including usage examples and API references.

## Architectural Decision Records

Each architectural decision is documented in the `apps/docs/adr` directory. These records provide context and rationale for design choices, helping maintain clarity and consistency as the project evolves.

## Glossary

Login, logout, and registration are not acceptable terms in this project. Instead, we use the following terminology:

- **Sign In**: The process of authenticating a user with their credentials.
- **Sign Out**: The process of terminating a user's session, effectively logging them out.
- **Sign Up**: The process of creating a new user account, typically involving registration with an email and password.
- **Session**: A temporary state that maintains user authentication status, allowing access to protected resources.
- **Session Timeout**: The duration after which a session expires, requiring the user to sign in again.
- **Identity** - A representation of a user within the authentication system, including their credentials and associated metadata. An identity correlates an individual user with their authentication credentials, such as email and password, or OAuth tokens. A user can have multiple identities (e.g., one for email/password and another for OAuth).

## Ongoing Documentation

Documentation is continuously updated to reflect the latest architectural decisions, package features, and development practices. Key documentation files will be maintained in a docsify library in `apps/docs`. Docsify maintains a set of markdown files that are rendered as a static site, allowing for easy navigation and searchability.

## Initial Functionality

### Web-Based Authentication

#### Traditional Registration

An unauthenticated user can register by providing a valid, unique email address, password, and password. The system will validate the input, hash the password, and store the user in the database.

Passwords should not be stored in plaintext. Instead, they should be hashed using a secure hashing algorithm (e.g., bcrypt) before being stored in the database.

Passwords requirements should be configurable, allowing for flexibility in password policies (e.g., minimum length, complexity requirements).

### Traditional Sign In

An unauthenticated user can sign in by providing a valid email address and password. The system will validate the credentials, check the password against the stored hash, and create a session if successful. The system should not reveal whether the email address exists in the system to prevent enumeration attacks. It should simply indicate whether the sign-in was successful or not.

### Forgot Password

An authenticated user can request a password reset by providing their email address. The system will generate a secure, perishable token, send it to the user's email, and allow them to reset their password using that token. The token should have an expiration time to prevent misuse.

Tokens cannot be reused. Once a password is reset using a token, the token should be invalidated to prevent further use. There should also be a configurable TTL (time-to-live) for the token, after which it will expire and no longer be valid.

Different email providers should be considered. Basic SMTP support is required, but more advanced providers (e.g., SendGrid, Mailgun) may be added later.

### Password Reset Email Confirmation

Upon resetting their password, the user should receive a confirmation email indicating that their password has been successfully changed. This email should not contain the new password but simply confirm the change and offer an opportunity to take action if the user did not initiate the change.

### Sign Out

An authenticated user can sign out by terminating their session. The system should invalidate the user's session token, preventing further access to protected resources until the user signs in again. Systemically, the user should be forgotten until they sign in again, at which point a new session is created.
