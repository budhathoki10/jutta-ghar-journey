import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const SiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-ink/5 to-terracotta/10 backdrop-blur-sm">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-ink">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/catalog" className="text-sm text-foreground/70 transition hover:text-primary hover:translate-x-0.5">
                  → Product Catalog
                </Link>
              </li>
              <li>
                <Link to="/shop-floors" className="text-sm text-foreground/70 transition hover:text-terracotta hover:translate-x-0.5">
                  → Shop Floors
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-foreground/70 transition hover:text-primary hover:translate-x-0.5">
                  → About Us
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
