import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tollflow_token') || null);
  const [loading, setLoading] = useState(true);

  // Axios Interceptor for token injection
  axios.interceptors.request.use((config) => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('tollflow_token', token);
      fetchUser();
    } else {
      localStorage.removeItem('tollflow_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/me`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { success: false, msg: err.response?.data?.msg || 'Server Error' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
