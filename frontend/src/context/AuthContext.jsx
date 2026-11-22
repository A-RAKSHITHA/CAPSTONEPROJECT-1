import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('arogya_token');
      const storedUser = localStorage.getItem('arogya_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to restore authentication state:', e);
      localStorage.removeItem('arogya_token');
      localStorage.removeItem('arogya_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    const authData = response.data;

    localStorage.setItem('arogya_token', authData.token);
    localStorage.setItem('arogya_user', JSON.stringify(authData));

    setToken(authData.token);
    setUser(authData);
    return authData;
  };

  const register = async (userData) => {
    const response = await authApi.register(userData);
    const authData = response.data;

    localStorage.setItem('arogya_token', authData.token);
    localStorage.setItem('arogya_user', JSON.stringify(authData));

    setToken(authData.token);
    setUser(authData);
    return authData;
  };

  const logout = () => {
    localStorage.removeItem('arogya_token');
    localStorage.removeItem('arogya_user');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('arogya_user', JSON.stringify(updated));
  };

  const role = user?.role || null;
  const isUser = role === 'ROLE_USER';
  const isNurse = role === 'ROLE_NURSE';
  const isAdmin = role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        isAuthenticated: !!token && !!user,
        isUser,
        isNurse,
        isAdmin,
        login,
        register,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
