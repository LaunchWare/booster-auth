// Represents a generic identity structure.
// Specific identity types (e.g., email/password, OAuth) would extend or implement this.
export interface Identity {
  id: string; // Unique identifier for the identity
  type: string; // Type of identity (e.g., 'password', 'oauth_google')
  userId: string; // Foreign key to the User entity
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  // Additional properties can be added by specific identity types
  [key: string]: any;
}
