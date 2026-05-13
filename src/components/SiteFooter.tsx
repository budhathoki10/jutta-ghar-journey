import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-background via-ink/3 to-terracotta/5 backdrop-blur-sm">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-mustard/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:py-24 relative z-10">
        <div className="grid gap-12 sm:gap-8 md:gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Quick Links */}
          <div className="group">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-ink group-hover:text-primary transition">§ Shop</h3>
            <ul className="space-y-3.5">
              <li>
                <Link to="/catalog" className="text-xs sm:text-sm text-foreground/70 transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-2">
                  <span className="text-primary/0 group-hover:text-primary/100">→</span>
                  <span>Product Catalog</span>
                </Link>
              </li>
              <li>
                <Link to="/shop-floors" className="text-xs sm:text-sm text-foreground/70 transition-all hover:text-terracotta hover:translate-x-1 inline-flex items-center gap-2">
                  <span className="text-terracotta/0 group-hover:text-terracotta/100">→</span>
                  <span>Shop Floors</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-xs sm:text-sm text-foreground/70 transition-all hover:text-primary hover:translate-x-1 inline-flex items-center gap-2">
                  <span className="text-primary/0 group-hover:text-primary/100">→</span>
                  <span>About Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-ink">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-sm text-foreground/70 transition hover:text-primary hover:translate-x-0.5">
                  → Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-foreground/70 transition hover:text-terracotta hover:translate-x-0.5">
                  → Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-foreground/70 transition hover:text-primary hover:translate-x-0.5">
                  → Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-ink">Contact</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-terracotta" />
                <span className="text-sm text-foreground/70">Jagatsundar Marg, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                <a href="tel:+97714XXXXXXX" className="text-sm text-foreground/70 transition hover:text-primary">
                  +977-1-4XXXXXXX
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-mustard" />
                <a href="mailto:info@gogojuttghar.com" className="text-sm text-foreground/70 transition hover:text-primary">
                  info@gogo.local
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-foreground/60">
            © {currentYear} GoGo Jutta Ghar
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-xs text-foreground/60 transition hover:text-primary">
              Privacy
            </Link>
            <div className="h-4 w-px bg-border/50" />
            <Link to="/terms" className="text-xs text-foreground/60 transition hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
