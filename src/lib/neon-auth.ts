import { createAuthClient } from "better-auth/react";

// Neon Auth URL from your Neon Console
const authUrl = import.meta.env.VITE_NEON_AUTH_URL || '';

if (!authUrl && import.meta.env.DEV) {
  console.warn('VITE_NEON_AUTH_URL is not set. Authentication will not work.');
}

export const authClient = createAuthClient({
  baseURL: authUrl,
});

// Export auth methods for easy access
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
