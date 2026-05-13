import { ScrollReveal } from "@/components/ScrollReveal";
import { Instagram, MapPin, MessageCircle, Phone } from "lucide-react";

const contactPersons = [
  {
    role: "GoGo Shoes Owner",
    description: "Direct orders and shop enquiries",
    phone: "+977 9841 898 731",
    availability: "Available all time at the shop",
  },
  {
    role: "Instagram Enquiries",
    description: "Quick social support for product questions",
    phone: "+977 9843 183 764",
    contact: "instagram",
  },
  {
    role: "WhatsApp Enquiries",
    description: "Fast WhatsApp support for custom orders",
    phone: "+977 9865 481 109",
    contact: "whatsapp",
  },
];

interface ContactSectionProps {
  id?: string;
}

const ContactSection = ({ id }: ContactSectionProps) => (
  <section id={id} className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent to-primary/5">
    <div className="mx-auto max-w-4xl space-y-8 sm:space-y-12">
      <ScrollReveal>
        <div className="space-y-2 sm:space-y-4">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-terracotta">§ 05 — सम्पर्क · Contact</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-ink">Talk directly with the team.</h2>
          <p className="text-base sm:text-lg text-foreground/70">
            For direct orders, Instagram enquiries, and WhatsApp support — these are the people ready to help.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 p-2">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-ink">Store Line</h3>
            </div>
            <p className="text-xs uppercase tracking-wider text-foreground/60 mb-2">Immediate orders & enquiries</p>
            <a href="tel:+9779841898731" className="text-base sm:text-lg font-bold text-primary hover:text-primary/80 transition">
              +977 9841 898 731
            </a>
          </div>

          <div className="rounded-xl border border-terracotta/20 bg-terracotta/5 p-4 sm:p-6 md:p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-terracotta/20 p-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-terracotta" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-ink">Visit</h3>
            </div>
            <p className="text-xs uppercase tracking-wider text-foreground/60 mb-2">Open daily · Walk-ins welcome</p>
            <p className="text-base sm:text-lg font-bold text-foreground">Jagatsundar Marg</p>
            <p className="text-xs sm:text-sm text-foreground/60 mt-1">Kathmandu, Nepal</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="rounded-xl border border-border/50 bg-background/50 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Connect on TikTok</p>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-foreground/70">Follow shop updates, new arrivals, and quick style tips from the street.</p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary whitespace-nowrap"
            >
              TikTok profile
            </a>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="space-y-2 sm:space-y-4 mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-black text-ink">Our Team</h3>
        </div>
      </ScrollReveal>

      <div className="space-y-3 sm:space-y-4">
        {contactPersons.map((person, idx) => (
          <ScrollReveal key={idx} delay={idx * 100}>
            <div className="rounded-xl border border-border/50 bg-background/50 p-4 sm:p-6 transition hover:border-primary/50 hover:bg-primary/5">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-ink mb-1">{person.role}</h4>
                  <p className="text-xs sm:text-sm text-foreground/70 mb-2 sm:mb-3">{person.description}</p>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <a href={`tel:${person.phone.replace(/\s/g, '')}`} className="text-xs sm:text-sm font-semibold text-primary hover:underline break-all">
                      {person.phone}
                    </a>
                    {person.availability && <p className="text-xs text-foreground/60">{person.availability}</p>}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {person.contact === 'instagram' && (
                    <a
                      href="#"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                  )}
                  {person.contact === 'whatsapp' && (
                    <a
                      href={`https://wa.me/${person.phone.replace(/\s|\+/g, '')}`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal>
        <div className="rounded-xl border border-mustard/20 bg-mustard/5 p-4 sm:p-6 md:p-8">
          <h4 className="mb-3 sm:mb-4 font-bold text-base sm:text-lg text-ink">Hours & Location</h4>
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <p>
              <span className="font-semibold text-ink">Hours:</span>{' '}
              <span className="text-foreground/70">Mon–Sat, 10:00 — 19:00</span>
            </p>
            <p>
              <span className="font-semibold text-ink">Address:</span>{' '}
              <span className="text-foreground/70">Jagatsundar Marg, Kathmandu, Nepal</span>
            </p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="bg-gradient-to-r from-ink/5 to-terracotta/10 rounded-xl py-8 sm:py-12 px-4 sm:px-8 text-center">
          <h4 className="text-xl sm:text-2xl font-bold text-ink mb-3 sm:mb-4">Ready to connect?</h4>
          <p className="text-xs sm:text-base text-foreground/70 mb-4 sm:mb-6">Pick your preferred way to reach us — we're here to help.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <a
              href="tel:+9779841898731"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Call
            </a>
            <a
              href="https://instagram.com"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Instagram
            </a>
            <a
              href="https://wa.me/9779865481109"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default ContactSection;
