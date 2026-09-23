import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dwellio_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from token on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('dwellio_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res?.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (error) {
          console.warn('Session expired or invalid:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.token && res.user) {
      localStorage.setItem('dwellio_token', res.token);
      localStorage.setItem('dwellio_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Invalid login response from server');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.token && res.user) {
      localStorage.setItem('dwellio_token', res.token);
      localStorage.setItem('dwellio_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('dwellio_token');
    localStorage.removeItem('dwellio_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem('dwellio_user', JSON.stringify(res.user));
    }
    return res;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    role: user?.role || null,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
