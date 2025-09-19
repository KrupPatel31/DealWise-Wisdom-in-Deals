import { useState, useEffect, createContext, useContext } from 'react';

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('dealwise_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('dealwise_users') || '[]');
      if (existingUsers.find((u: any) => u.email === email)) {
        return { error: { message: 'User already exists with this email' } };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        fullName,
        password // In real app, this should be hashed
      };

      // Store user
      existingUsers.push(newUser);
      localStorage.setItem('dealwise_users', JSON.stringify(existingUsers));

      // Set current user
      const userWithoutPassword = { id: newUser.id, email: newUser.email, fullName: newUser.fullName };
      setUser(userWithoutPassword);
      localStorage.setItem('dealwise_user', JSON.stringify(userWithoutPassword));

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to create account' } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('dealwise_users') || '[]');
      const user = existingUsers.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        return { error: { message: 'Invalid email or password' } };
      }

      const userWithoutPassword = { id: user.id, email: user.email, fullName: user.fullName };
      setUser(userWithoutPassword);
      localStorage.setItem('dealwise_user', JSON.stringify(userWithoutPassword));

      return { error: null };
    } catch (error) {
      return { error: { message: 'Failed to sign in' } };
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('dealwise_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signUp,
      signIn,
      signOut
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