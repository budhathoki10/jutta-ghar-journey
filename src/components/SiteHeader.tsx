import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroLogo from "@/assets/hero-shoes.jpg";

const desktopNavItems = [
  { label: "Home", to: "/", match: (pathname: string, hash: string) => pathname === "/" && !hash },
  { label: "Product Catalog", to: "/catalog", match: (pathname: string) => pathname === "/catalog" },
  {
    label: "About Us",
    to: "/#story",
    match: (pathname: string, hash: string) => pathname === "/" && hash === "#story" || pathname === "/about",
  },
  {
    label: "Contact Us",
    to: "/#contact",
    match: (pathname: string, hash: string) => pathname === "/" && hash === "#contact" || pathname === "/contact",
  },
];

const mobileNavItems = [
  ...desktopNavItems,
  { label: "Admin", to: "/admin/login" },
];

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Close on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isItemActive = (item: { to: string; match?: (pathname: string, hash: string) => boolean }) => {
    if (item.match) return item.match(location.pathname, location.hash);
    return location.pathname === item.to;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <NavLink
          to="/"
          className="group inline-flex items-center gap-3 text-2xl font-black tracking-tight text-ink transition-transform duration-300 hover:-translate-y-0.5"
        >
          <img src={heroLogo} alt="GoGo Jutta Ghar" className="h-11 w-11 rounded-full object-cover shadow-sm" />
          <div>
            <span>GoGo</span>
            <span className="block text-xs uppercase tracking-[0.35em] text-muted-foreground">Jutta Ghar</span>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={() =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isItemActive(item) ? "text-primary" : "text-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Button asChild variant="secondary" className="rounded-full px-4 py-2 text-sm font-semibold">
            <NavLink to="/catalog">Browse Collection</NavLink>
          </Button>
          <Button asChild className="rounded-full px-4 py-2 text-sm font-semibold">
            <NavLink to="/admin/login">Admin Panel</NavLink>
          </Button>
        </div>

        {/* Mobile hamburger + dropdown wrapper */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-ink shadow-sm transition hover:bg-secondary"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Floating dropdown */}
          <div
            className={cn(
              "absolute right-0 top-[calc(100%+8px)] w-56 origin-top-right rounded-2xl border border-border bg-background shadow-xl ring-1 ring-black/5 transition-all duration-200",
              menuOpen
                ? "scale-100 opacity-100 pointer-events-auto"
                : "scale-95 opacity-0 pointer-events-none"
            )}
          >
            {/* Arrow pointing up */}
            <div className="absolute -top-2 right-3 h-4 w-4 rotate-45 rounded-sm border-l border-t border-border bg-background" />

            <div className="relative p-2">
              {mobileNavItems.map((item, i) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={() =>
                    cn(
                      "flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                      isItemActive(item)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-secondary"
                    )
                  }
                >
                  {item.label}
                  {/* Divider except last */}
                  {i < mobileNavItems.length - 1 && (
                    <span className="sr-only">divider</span>
                  )}
                </NavLink>
              ))}

              {/* Browse button */}
              <div className="mt-2 border-t border-border pt-2">
                <NavLink
                  to="/catalog"
                  onClick={() => setMenuOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-terracotta-deep"
                >
                  Browse Collection
                </NavLink>
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default SiteHeader;