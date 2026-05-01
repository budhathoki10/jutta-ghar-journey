import React, { createContext, useState, useEffect } from 'react';
import { adminLogin, getMe } from '../api/adminApi';

type AuthContextType = {
  admin: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  admin: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      // try to fetch admin
      getMe()
        .then((res) => setAdmin(res.data))
        .catch(() => {
          localStorage.removeItem('admin_token');
          setAdmin(null);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await adminLogin({ email, password });
    const token = res.data.token;
    localStorage.setItem('admin_token', token);
    const me = await getMe();
    setAdmin(me.data);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, login, logout }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
