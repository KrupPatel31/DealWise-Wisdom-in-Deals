import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession, signIn as neonSignIn, signUp as neonSignUp, signOut as neonSignOut } from '@/lib/neon-auth';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback API URL for password reset (uses existing backend)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email,
        fullName: session.user.name || '',
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const result = await neonSignUp.email({
        email,
        password,
        name: fullName,
      });
      
      if (result.error) {
        return { error: { message: result.error.message || 'Registration failed' } };
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Network error. Please check your connection.' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await neonSignIn.email({
        email,
        password,
      });
      
      if (result.error) {
        return { error: { message: result.error.message || 'Invalid email or password' } };
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Network error. Please check your connection.' } };
    }
  };

  const signOut = async () => {
    try {
      await neonSignOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading: isPending,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export API_URL for password reset pages
export { API_URL };
