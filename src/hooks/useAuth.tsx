import { useState, useEffect, createContext, useContext } from 'react';

interface User {
  id: string;
  email: string;
  full_name: string;
  email_verified: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (fullName: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:3000/api';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and fetch profile
    const checkAuth = async () => {
      const token = localStorage.getItem('dealwise_access_token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/user/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('dealwise_access_token');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('dealwise_access_token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Registration failed' } };
      }

      // Store access token
      localStorage.setItem('dealwise_access_token', data.accessToken);
      setUser(data.user);

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to create account' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for refresh token
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Login failed' } };
      }

      // Store access token
      localStorage.setItem('dealwise_access_token', data.accessToken);
      setUser(data.user);

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to sign in' } };
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('dealwise_access_token');
    }
  };

  const updateProfile = async (fullName: string) => {
    try {
      const token = localStorage.getItem('dealwise_access_token');
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.error || 'Update failed' } };
      }

      setUser(data.user);
      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to update profile' } };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile
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