import React, { createContext, useState, useEffect } from 'react';
import { adminLogin, getMe } from '../api/adminApi';

type AdminUser = {
  id: string;
  email: string;
};

type AuthContextType = {
  admin: AdminUser | null;
  authLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  admin: null,
  authLoading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const setCookie = (name: string, value: string, days?: number) => {
    const expires = typeof days === 'number'
      ? `;expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}`
      : '';
    document.cookie = `${name}=${value}${expires};path=/;SameSite=Lax`;
  };

  const getCookie = (name: string) => {
    const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
    return v ? v.pop() : '';
  };

  const getStoredToken = () => {
    try {
      return getCookie('admin_token') ||
        localStorage.getItem('admin_token') ||
        sessionStorage.getItem('admin_token') ||
        '';
    } catch {
      return getCookie('admin_token') || '';
    }
  };

  const setToken = (token: string, rememberMe = true) => {
    clearToken();

    if (rememberMe) {
      setCookie('admin_token', token, 30);
      try {
        localStorage.setItem('admin_token', token);
      } catch {
        // Ignore localStorage errors in restricted browsers
      }
      return;
    }

    setCookie('admin_token', token);
    try {
      sessionStorage.setItem('admin_token', token);
    } catch {
      // Ignore sessionStorage errors in restricted browsers
    }
  };

  const clearToken = () => {
    document.cookie = 'admin_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    try {
      localStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_token');
    } catch {
      // Ignore storage errors in restricted browsers
    }
  };

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      getMe()
        .then((res) => setAdmin(res.data))
        .catch(() => {
          clearToken();
          setAdmin(null);
        })
        .finally(() => setAuthLoading(false));
      return;
    }

    setAuthLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe = true) => {
    setAuthLoading(true);
    try {
      const res = await adminLogin({ email, password });
      const token = res.data.token;
      setToken(token, rememberMe);
      const me = await getMe();
      setAdmin(me.data);
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, authLoading, login, logout }}>{children}</AuthContext.Provider>;
}
export default AuthContext;
