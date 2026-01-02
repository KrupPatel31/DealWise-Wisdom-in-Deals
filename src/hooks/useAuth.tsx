import { useState, useEffect, createContext, useContext, useCallback } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  getAuthHeader: () => { Authorization: string } | {};
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API URL - configure this for production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Clear any insecure legacy localStorage data on mount
  useEffect(() => {
    // Remove insecure plaintext password storage from previous implementation
    localStorage.removeItem('dealwise_users');
    localStorage.removeItem('dealwise_user');
    
    // Try to restore session via refresh token (httpOnly cookie)
    const initAuth = async () => {
      try {
        const token = await refreshAccessToken();
        if (token) {
          // Fetch user profile if we have a valid token
          const response = await fetch(`${API_URL}/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            setUser({
              id: data.user.id,
              email: data.user.email,
              fullName: data.user.full_name
            });
          }
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include' // Required for httpOnly cookies
      });
      
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        return data.accessToken;
      }
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return null;
    }
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, full_name: fullName })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Registration failed' } };
      }

      // Store access token in memory only (not localStorage)
      setAccessToken(data.accessToken);
      setUser({
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.full_name
      });

      return { error: null };
    } catch (error) {
      return { error: { message: 'Network error. Please check your connection.' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Invalid email or password' } };
      }

      // Store access token in memory only (not localStorage)
      setAccessToken(data.accessToken);
      setUser({
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.full_name
      });

      return { error: null };
    } catch (error) {
      return { error: { message: 'Network error. Please check your connection.' } };
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state regardless of API success
      setUser(null);
      setAccessToken(null);
    }
  };

  const getAuthHeader = useCallback(() => {
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` };
    }
    return {};
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      accessToken,
      signUp,
      signIn,
      signOut,
      refreshAccessToken,
      getAuthHeader
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
