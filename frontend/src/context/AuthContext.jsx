import { createContext, useContext, useEffect, useState } from 'react';
import { post } from '../api/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lead-management-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('lead-management-token'));

  useEffect(() => {
    if (user) {
      localStorage.setItem('lead-management-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('lead-management-user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('lead-management-token', token);
    } else {
      localStorage.removeItem('lead-management-token');
    }
  }, [token]);

  const login = async (credentials) => {
    const data = await post('/auth/login', credentials);
    setToken(data.token);
    const decoded = JSON.parse(atob(data.token.split('.')[1]));
    setUser({ id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role });
    return data;
  };

  const register = async (payload) => {
    return post('/auth/register', payload);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
