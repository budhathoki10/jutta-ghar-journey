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
  try {
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
      console.log("errors")
      const res = await adminLogin({ email, password });
      console.log("response admin login",res)
      const token = res.data.token;
      console.log("inside auth context tsx")
      localStorage.setItem('admin_token', token);
      const me = await getMe();
      console.log("me data is",me.data)
      console.log("me  is",me)
  
      setAdmin(me.data);
    };
  
    const logout = () => {
      localStorage.removeItem('admin_token');
      setAdmin(null);
    };
  
    return <AuthContext.Provider value={{ admin, login, logout }}>{children}</AuthContext.Provider>;
  }
  catch (err: any) {
     console.log("Status:",  err.response?.status);   // 401? 404? 500?
  console.log("Data:",    err.response?.data);      // backend error message
  console.log("Message:", err.message)
  }
}
export default AuthContext;
