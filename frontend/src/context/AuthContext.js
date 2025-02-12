import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // Set up token refresh interval
    const refreshInterval = setInterval(() => {
      if (user) {
        refreshToken();
      }
    }, 23 * 60 * 60 * 1000); // Refresh every 23 hours

    return () => clearInterval(refreshInterval);
  }, [user]);

  const refreshToken = async () => {
    try {
      await api.post('/auth/refresh');
    } catch (err) {
      console.error('Token refresh failed:', err);
      setUser(null);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      setUser(null);
      console.error('Auth check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.user) {
        setUser(response.data.user);
      }
      return response.data;
    } catch (err) {
      console.error('Login failed:', err);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.user) {
        setUser(response.data.user);
      }
      return response.data;
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear the user state even if the logout request fails
      setUser(null);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 