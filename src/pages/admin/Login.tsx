import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, LockKeyhole } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import heroShoes from '../../assets/hero-shoes.jpg';

type LoginError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { admin, authLoading, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && admin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [admin, authLoading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: unknown) {
      const loginError = err as LoginError;
      const message = loginError.response?.data?.message || loginError.message || 'Login failed';
      alert(message);
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-sm border border-border bg-card p-6 shadow-soft sm:p-8">
        <div className="mb-7 text-center">
          <img
            src={heroShoes}
            alt="GoGo Jutta Ghar"
            className="mx-auto h-14 w-14 rounded-full border border-border bg-card object-cover shadow-sm ring-4 ring-primary/10"
          />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Admin access
          </p>
          <h1 className="mt-3 text-3xl font-black text-ink">Sign in to inventory</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage products, images, and store listings.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
              autoComplete="email"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
              autoComplete="current-password"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-sm border border-border bg-background px-4 py-3">
            <span>
              <span className="block text-sm font-semibold text-ink">Remember me</span>
              <span className="text-xs text-muted-foreground">Stay signed in on this device until logout.</span>
            </span>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>

          <Button
            type="submit"
            disabled={loading || authLoading}
            className="h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-terracotta-deep"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
