// Example API calls to use from your React frontend

const API_BASE_URL = 'http://localhost:5000/api';

// Authentication API calls
export const authAPI = {
  // Register a new user
  async register(email, password, fullName) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName
      }),
    });
    
    return await response.json();
  },

  // Login user
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({
        email,
        password
      }),
    });
    
    return await response.json();
  },

  // Refresh access token
  async refreshToken() {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });
    
    return await response.json();
  },

  // Logout user
  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });
    
    return await response.json();
  },

  // Request password reset
  async requestPasswordReset(email) {
    const response = await fetch(`${API_BASE_URL}/auth/request-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    return await response.json();
  },

  // Reset password
  async resetPassword(token, password) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        password
      }),
    });
    
    return await response.json();
  },

  // Verify email
  async verifyEmail(token) {
    const response = await fetch(`${API_BASE_URL}/auth/verify?token=${token}`, {
      method: 'GET',
    });
    
    return await response.json();
  }
};

// User API calls (require authentication)
export const userAPI = {
  // Get user profile
  async getProfile(accessToken) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return await response.json();
  },

  // Update user profile
  async updateProfile(accessToken, fullName) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: fullName
      }),
    });
    
    return await response.json();
  }
};

// Example usage in a React component:
/*
import { authAPI, userAPI } from './api/auth';

const LoginComponent = () => {
  const [accessToken, setAccessToken] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      const result = await authAPI.login(email, password);
      if (result.accessToken) {
        setAccessToken(result.accessToken);
        // Store in context/state management
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGetProfile = async () => {
    try {
      const profile = await userAPI.getProfile(accessToken);
      console.log('User profile:', profile);
    } catch (error) {
      // Token might be expired, try refresh
      const refreshResult = await authAPI.refreshToken();
      if (refreshResult.accessToken) {
        setAccessToken(refreshResult.accessToken);
        // Retry the original request
      }
    }
  };

  return (
    // Your component JSX
  );
};
*/