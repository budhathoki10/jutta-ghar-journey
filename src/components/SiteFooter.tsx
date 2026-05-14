import { Mail, MapPin, Phone, X, Linkedin, Instagram, Facebook, ArrowUp } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="border-t border-slate-700 bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1fr] xl:grid-cols-[1.2fr_0.85fr_0.85fr]">
          <div className="space-y-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold tracking-[0.18em] text-amber-300">
                <span className="text-lg">Δ</span>
                ATARAXIS
              </span>
            </div>

            <p className="max-w-xl text-sm leading-7 text-slate-300">
              Empowering physicians with advanced multi-modal tools to improve treatment selection and patient outcomes.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-slate-400">
              <a href="#" aria-label="X" className="rounded-full border border-slate-800 p-2 transition hover:border-amber-400 hover:text-amber-300">
                <X className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="rounded-full border border-slate-800 p-2 transition hover:border-amber-400 hover:text-amber-300">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="rounded-full border border-slate-800 p-2 transition hover:border-amber-400 hover:text-amber-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full border border-slate-800 p-2 transition hover:border-amber-400 hover:text-amber-300">
                <Facebook className="h-4 w-4" />
              </a>
            </div>

            <a
              href="#top"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300 transition hover:bg-slate-800"
            >
              <ArrowUp className="h-4 w-4" />
              Back to top
            </a>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Site Map</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <a href="/" className="transition hover:text-white hover:underline">
                  Homepage
                </a>
              </li>
              <li>
                <a href="/technology" className="transition hover:text-white hover:underline">
                  Technology
                </a>
              </li>
              <li>
                <a href="/ataraxis-breast" className="transition hover:text-white hover:underline">
                  Ataraxis Breast
                </a>
              </li>
              <li>
                <a href="/resources" className="transition hover:text-white hover:underline">
                  Resources & news
                </a>
              </li>
              <li>
                <a href="/careers" className="transition hover:text-white hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="/contact" className="transition hover:text-white hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/portal" className="transition hover:text-white hover:underline">
                  Portal
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Legal</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <a href="/privacy" className="transition hover:text-white hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="transition hover:text-white hover:underline">
                  Terms of Services
                </a>
              </li>
              <li>
                <a href="/lawyers-corner" className="transition hover:text-white hover:underline">
                  Lawyer&apos;s Corners
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-amber-500/10 px-6 py-4 text-center text-xs text-slate-300 sm:px-8">
        © 2024, ataraxis.ai. All Rights Reserved.
      </div>
    </footer>
  );
};

export default SiteFooter;
