import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, Phone, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { phoneHref } from "@/content/site";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

type NavItem = {
  label: string;
  to: string;
  match?: (pathname: string, hash: string) => boolean;
};

const navItems: NavItem[] = [
  { label: "Home", to: "/", match: (pathname) => pathname === "/" },
  { label: "Shoes", to: "/catalog", match: (pathname) => pathname === "/catalog" || pathname.startsWith("/shoes") },
  { label: "Shop Floors", to: "/shop-floors", match: (pathname) => pathname === "/shop-floors" },
  { label: "About", to: "/about", match: (pathname) => pathname === "/about" },
  { label: "Contact", to: "/contact", match: (pathname) => pathname === "/contact" },
];

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isItemActive = (item: NavItem) => {
    if (item.match) return item.match(location.pathname, location.hash);
    return location.pathname === item.to;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 xs:px-4 sm:gap-3 sm:px-6">
        <NavLink
          to="/"
          className="group inline-flex min-w-0 items-center gap-2 text-ink transition-transform duration-300 hover:-translate-y-0.5 sm:gap-3"
          aria-label="GoGo Jutta Ghar home"
        >
          <img src={logo} alt="GoGo Jutta Ghar" className="h-9 w-9 shrink-0 rounded-full border border-border bg-card object-contain p-1 shadow-sm xs:h-10 xs:w-10 sm:h-12 sm:w-12" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-black leading-tight tracking-tight xs:text-base sm:text-xl">GoGo Jutta Ghar</span>
            <span className="block text-[8px] uppercase tracking-[0.18em] text-muted-foreground xs:text-[9px] xs:tracking-[0.24em] sm:text-[10px]">Jagatsundar Marg</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-7 lg:flex">
          <nav className="flex items-center gap-7" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-primary",
                  isItemActive(item) ? "text-primary" : "text-foreground/80"
                )}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="h-10 rounded-full border-ink/30 px-4 text-sm font-semibold">
              <a href={phoneHref}>
                <Phone className="mr-2 h-4 w-4" />
                Call Store
              </a>
            </Button>
            <Button asChild className="h-10 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-terracotta-deep">
              <NavLink to="/catalog">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Shoes
              </NavLink>
            </Button>
          </div>
        </div>

        <div className="relative flex items-center gap-2 lg:hidden" ref={menuRef}>
          <a
            href={phoneHref}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition hover:border-primary hover:text-primary xs:h-10 xs:w-10"
            aria-label="Call GoGo Jutta Ghar"
          >
            <Phone className="h-4 w-4" />
          </a>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-ink shadow-sm transition hover:border-primary hover:text-primary xs:h-10 xs:w-10"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div
            className={cn(
              "absolute right-0 top-[calc(100%+10px)] w-[min(92vw,22rem)] origin-top-right rounded-[1.5rem] border border-border bg-background p-2 shadow-xl ring-1 ring-black/5 transition-all duration-200",
              menuOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
            )}
          >
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                    isItemActive(item) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-secondary/80"
                  )}
                >
                  {item.label}
                  {isItemActive(item) && <span className="h-2 w-2 rounded-full bg-primary" />}
                </NavLink>
              ))}
            </nav>

            <div className="mt-2 grid gap-2 border-t border-border pt-2">
              <NavLink
                to="/catalog"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-terracotta-deep"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse Shoes
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
