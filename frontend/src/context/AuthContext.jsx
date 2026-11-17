import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On every page load, ask the server who we are. The HTTP-only cookie keeps us logged in across refreshes.
  useEffect(() => {
    api.get('/auth/me').then((r) => setUser(r.data.user)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    setUser(data.user);
    return data.user;
  };
  const register = async (details) => {
    const { data } = await api.post('/auth/register', details);
    setUser(data.user);
    return data.user;
  };
  const logout = async () => {
    try { await api.post('/auth/logout'); } finally { setUser(null); }
  };

  return <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
