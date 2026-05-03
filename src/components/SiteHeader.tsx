import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroLogo from "@/assets/hero-shoes.jpg";

const desktopNavItems = [
  { label: "Home", to: "/" },
  { label: "Product Catalog", to: "/catalog" },
  { label: "About Us", to: "/#about" },
  { label: "Contact Us", to: "/#contact" },
];

const mobileNavItems = [
  ...desktopNavItems,
  { label: "Admin", to: "/admin/login" },
];

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="group inline-flex items-center gap-3 text-2xl font-black tracking-tight text-ink transition-transform duration-300 hover:-translate-y-0.5">
          <img src={heroLogo} alt="GoGo Jutta Ghar" className="h-11 w-11 rounded-full object-cover shadow-sm" />
          <div>
            <span>GoGo</span>
            <span className="block text-xs uppercase tracking-[0.35em] text-muted-foreground">Jutta Ghar</span>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button asChild variant="secondary" className="rounded-full px-4 py-2 text-sm font-semibold">
            <NavLink to="/catalog">Browse Collection</NavLink>
          </Button>
          <Button asChild className="rounded-full px-4 py-2 text-sm font-semibold">
            <NavLink to="/admin/login">Admin Panel</NavLink>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition hover:bg-secondary md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("md:hidden overflow-hidden transition-all duration-300", menuOpen ? "max-h-[480px]" : "max-h-0")}>
        <div className="space-y-2 border-t border-border/70 bg-background px-6 pb-6 pt-4">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
