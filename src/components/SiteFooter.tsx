import { Link } from "react-router-dom";
import { Facebook, Instagram, KeyRound, MessageCircle, Phone, Youtube } from "lucide-react";
import { businessName, fullAddress, instagramLink, phoneHref, phoneNumber, tiktokLink, whatsappLink,youtubeChannelLink } from "@/content/site";

const SiteFooter = () => {
  return (
    <footer className="border-t border-ink/20 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-7 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
            <p className="font-serif text-2xl font-black tracking-tight">{businessName}</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-mustard">Kathmandu Shoe House</p>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-ink-foreground/75 xs:grid-cols-2 lg:max-w-3xl">
            <a href={phoneHref} className="flex items-center gap-2 transition hover:text-mustard">
                <Phone className="h-4 w-4 shrink-0 text-mustard" />
                {phoneNumber}
            </a>
            <p>{fullAddress}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-ink-foreground/70 lg:justify-end">
          <a href={instagramLink} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-ink-foreground/15 p-2 transition hover:border-mustard hover:text-mustard">
            <Instagram className="h-4 w-4" />
          </a>
          <a href={whatsappLink} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="rounded-full border border-ink-foreground/15 p-2 transition hover:border-mustard hover:text-mustard">
            <MessageCircle className="h-4 w-4" />
          </a>
          <a href={tiktokLink} target="_blank" rel="noreferrer" aria-label="TikTok" className="rounded-full border border-ink-foreground/15 px-3 py-2 text-xs font-bold transition hover:border-mustard hover:text-mustard">
            TT
          </a>
          <a href={youtubeChannelLink} target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full border border-ink-foreground/15 p-2 transition hover:border-mustard hover:text-mustard">
            <Youtube className="h-4 w-4" />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-ink-foreground/15 p-2 transition hover:border-mustard hover:text-mustard">
            <Facebook className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="border-t border-ink-foreground/10 px-4 py-3 text-xs text-ink-foreground/60 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <p>© 2026, GoGo Jutta Ghar.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="transition hover:text-white hover:underline">Privacy</Link>
            <Link to="/terms" className="transition hover:text-white hover:underline">Terms</Link>
            <Link to="/admin/login" className="inline-flex items-center gap-1 transition hover:text-white hover:underline">
              <KeyRound className="h-3.5 w-3.5" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
