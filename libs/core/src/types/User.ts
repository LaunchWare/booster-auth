// Represents a user in the system.
// This is a core type and should only contain primitive properties as per the user story.
export interface User {
  id: string; // Unique identifier for the user
  email: string; // User's email address, can be used for login or notifications
  createdAt: string; // ISO string representation of when the user was created
  updatedAt: string; // ISO string representation of when the user was last updated

  // emailVerified: boolean; // Example of a common field, to be added based on specific requirements
  // profile: UserProfile; // Example of linking to a more detailed user profile, if needed
}

// Example of a related type, which might be in its own file or module
// export interface UserProfile {
//   firstName?: string;
//   lastName?: string;
//   avatarUrl?: string;
// }
