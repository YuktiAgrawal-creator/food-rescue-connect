import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          fetchUser();
        }
      } catch (err) {
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me/');
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      logout();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await api.post('/auth/token/', { username, password });
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    return await fetchUser();
  };

  const register = async (userData) => {
    await api.post('/auth/register/', userData);
    return await login(userData.username, userData.password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
