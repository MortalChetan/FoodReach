import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('foodreach_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('foodreach_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      if (response.success && response.data) {
        const userData = response.data;
        setUser(userData);
        setToken(userData.token);
        localStorage.setItem('foodreach_token', userData.token);
        localStorage.setItem('foodreach_user', JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authApi.register(userData);
      if (response.success && response.data) {
        const userRes = response.data;
        setUser(userRes);
        setToken(userRes.token);
        localStorage.setItem('foodreach_token', userRes.token);
        localStorage.setItem('foodreach_user', JSON.stringify(userRes));
        return { success: true, user: userRes };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foodreach_token');
    localStorage.removeItem('foodreach_user');
  };

  // Demo accounts for fast 1-click testing
  const quickDemoLogin = async (roleType) => {
    const accounts = {
      DONOR: { email: 'donor@foodreach.org', password: 'password123' },
      NGO: { email: 'ngo@foodreach.org', password: 'password123' },
      VOLUNTEER: { email: 'volunteer@foodreach.org', password: 'password123' },
      ADMIN: { email: 'admin@foodreach.org', password: 'admin123' },
    };

    const target = accounts[roleType];
    if (target) {
      return await login(target.email, target.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        role: user?.role || null,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
