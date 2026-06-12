import React, { createContext, useState, useEffect } from 'react';
import { adminLogin, getMe } from '../api/adminApi';

type AdminUser = {
  id: string;
  email: string;
};

type AuthContextType = {
  admin: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  admin: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const setCookie = (name: string, value: string, days = 7) => {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const getCookie = (name: string) => {
    const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return v ? v.pop() : '';
  };

  const setToken = (token: string) => {
    setCookie('admin_token', token, 7);
    try {
      localStorage.setItem('admin_token', token);
    } catch (err) {
      // Ignore localStorage errors in restricted browsers
    }
  };

  const clearToken = () => {
    document.cookie = 'admin_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    try {
      localStorage.removeItem('admin_token');
    } catch (err) {
      // Ignore localStorage errors in restricted browsers
    }
  };

  useEffect(() => {
    const token = getCookie('admin_token') || localStorage.getItem('admin_token') || '';
    if (token) {
      getMe()
        .then((res) => setAdmin(res.data))
        .catch(() => {
          clearToken();
          setAdmin(null);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await adminLogin({ email, password });
    const token = res.data.token;
    setToken(token);
    const me = await getMe();
    setAdmin(me.data);
  };

  const logout = () => {
    clearToken();
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, login, logout }}>{children}</AuthContext.Provider>;
}
export default AuthContext;
