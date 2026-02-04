import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for active session on load
    const token = sessionStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(err => {
          console.error('Session restore failed:', err);
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    sessionStorage.setItem('token', res.data.token);
    // Fetch fresh user data from /auth/me to ensure we have all fields
    const userRes = await api.get('/auth/me');
    setUser(userRes.data);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    sessionStorage.setItem('token', res.data.token);
    // Fetch fresh user data from /auth/me to ensure we have all fields
    const userRes = await api.get('/auth/me');
    setUser(userRes.data);
    return res.data;
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
