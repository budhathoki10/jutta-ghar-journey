import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Package, PlusCircle, Store } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import { Button } from '../ui/button';
import SiteFooter from '../SiteFooter';
import heroShoes from '../../assets/hero-shoes.jpg';

const nav = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', to: '/admin/shoes', icon: Package },
  { label: 'Add Product', to: '/admin/add-shoe', icon: PlusCircle },
];

const AdminLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:py-6">
        <header className="mb-5 rounded-sm border border-border bg-card px-4 py-3 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <img
                src={heroShoes}
                alt="GoGo Jutta Ghar"
                className="h-11 w-11 shrink-0 rounded-full border border-border bg-card object-cover shadow-sm ring-2 ring-primary/10"
                style={{ objectPosition: 'center 34%' }}
              />
              <div>
                <h2 className="text-lg font-black text-ink">GoGo Jutta Ghar Admin</h2>
                <p className="text-sm text-muted-foreground">Products, images, and inventory controls</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button asChild variant="outline" className="rounded-full border-border">
                <Link to="/shoes">
                  <Store className="mr-2 h-4 w-4" />
                  View Store
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full border-border text-primary hover:bg-primary/10 hover:text-primary"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="rounded-sm border border-border bg-card p-3 shadow-card lg:sticky lg:top-6 lg:self-start">
            <nav className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const active =
                  location.pathname === item.to ||
                  (item.to === '/admin/shoes' && location.pathname.startsWith('/admin/edit-shoe'));

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={
                      'inline-flex min-h-12 items-center gap-3 rounded-sm px-3 py-2 text-sm font-semibold transition ' +
                      (active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-foreground/80 hover:bg-secondary hover:text-ink')
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="min-w-0 pb-8">{children}</main>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default AdminLayout;
