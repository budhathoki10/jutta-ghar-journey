import { useState } from "react";
import { ArrowUpRight, Instagram, MapPin, MessageCircle, Phone, Play } from "lucide-react";

const storeCards = [
  {
    label: "Store Line",
    value: "+977 9841 898 731",
    detail: "Immediate orders & enquiries",
    href: "tel:+9779841898731",
    icon: Phone,
  },
  {
    label: "Visit",
    value: "Jagatsundar Marg",
    detail: "Open daily · Walk-ins welcome",
    href: "https://www.google.com/maps/place/GoGo+Jutta+Ghar/@27.7082548,85.31198,17z",
    icon: MapPin,
  },
];

const staffContacts = [
  {
    role: "GoGo Shoes Owner",
    note: "Available all time at the shop",
    purpose: "Direct orders and shop enquiries",
    phone: "9841898731",
    actionLabel: "Connect on TikTok",
    actionHref: "https://www.tiktok.com/@kceybalaram?is_from_webapp=1&sender_device=pc",
  },
  {
    role: "Instagram Enquiries",
    note: "Quick social support for product questions",
    purpose: "Instagram enquiries",
    phone: "9843183764",
    actionLabel: "Connect on Instagram",
    actionHref: "https://www.instagram.com/gogo_juttaa_ghar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  {
    role: "WhatsApp Enquiries",
    note: "Fast WhatsApp support for custom orders",
    purpose: "WhatsApp enquiries",
    phone: "9865481109",
    actionLabel: "Chat on WhatsApp",
    actionHref: "https://wa.me/9779865481109",
  },
];

const Contact = () => {
  const [playing, setPlaying] = useState(false);
  const videoId = "SZMr39NJ76A";

  return (
    <div id="main-content" className="bg-background text-foreground">
      <section id="contact" className="bg-secondary/30 py-14 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center reveal">
            <p className="mb-3 text-xs tracking-[0.16em] text-muted-foreground">§ 05 — सम्पर्क · Contact</p>
            <h1 className="font-serif text-3xl font-black tracking-tight sm:text-5xl md:text-6xl">Talk directly with the team.</h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              For direct orders, Instagram enquiries, and WhatsApp support — these are the people ready to help.
            </p>
          </div>

          <div className="mx-auto mb-10 grid max-w-2xl grid-cols-2 gap-3 sm:gap-4 reveal">
            {storeCards.map((card) => {
              const Icon = card.icon;

              return (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.label === "Visit" ? "_blank" : undefined}
                  rel={card.label === "Visit" ? "noreferrer" : undefined}
                  className="group rounded-[1.75rem] border border-border bg-card p-4 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:border-primary/40 sm:p-6"
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary sm:mb-4 sm:h-11 sm:w-11">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <p className="text-[10px] tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.16em]">{card.label}</p>
                  <p className="mt-3 text-base font-semibold text-ink transition-colors group-hover:text-primary sm:text-2xl">{card.value}</p>
                  <p className="mt-2 text-xs leading-5 text-foreground/70 sm:text-sm">{card.detail}</p>
                </a>
              );
            })}
          </div>

          <div className="grid gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {staffContacts.map((contact, i) => (
              <article
                key={contact.role}
                className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-4 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg sm:p-6 reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] leading-4 tracking-[0.06em] text-muted-foreground sm:text-xs sm:tracking-[0.12em]">{contact.role}</p>
                    <p className="mt-3 text-xs leading-5 text-foreground/70 sm:mt-4 sm:text-sm sm:leading-6">{contact.note}</p>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-10 sm:w-10">
                    {contact.actionLabel.includes("Instagram") ? <Instagram className="h-4 w-4 sm:h-5 sm:w-5" /> : <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs sm:mt-5 sm:text-sm">
                  <p className="text-muted-foreground">{contact.purpose}</p>
                  <p>
                    <span className="font-semibold">Phone: </span>
                    <a href={`tel:+977${contact.phone}`} className="text-primary hover:underline">
                      {contact.phone}
                    </a>
                  </p>
                </div>

                <a
                  href={contact.actionHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition-all duration-300 hover:bg-terracotta-deep sm:mt-6 sm:px-4 sm:py-3 sm:text-sm"
                >
                  {contact.actionLabel}
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="video" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(150px,46vw)] items-center gap-4 sm:gap-10 md:grid-cols-12 md:gap-14">
          <div className="min-w-0 space-y-3 sm:space-y-5 md:col-span-7 reveal-left">
            <p className="text-[10px] tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.16em]">§ 06 — See the Shop</p>
            <h2 className="font-serif text-2xl font-black tracking-tight xs:text-3xl sm:text-5xl md:text-6xl">
              Step inside GoGo before you arrive.
            </h2>
            <p className="max-w-md text-xs leading-5 text-muted-foreground xs:text-sm sm:text-lg sm:leading-8">
              A quick look at the shop, the shelves, and the people behind the counter — straight from our social media.
            </p>

            <a
              href={`https://youtube.com/shorts/${videoId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Watch on YouTube <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mx-auto w-full max-w-[15.5rem] sm:max-w-[20rem] md:col-span-5 md:max-w-[340px] reveal-right">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-black shadow-soft ring-1 ring-border md:aspect-[9/16] md:rounded-[2rem]">
              {playing ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title="GoGo Shoes Shop"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <button type="button" className="relative h-full w-full text-left" onClick={() => setPlaying(true)} aria-label="Play GoGo shop video">
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="GoGo Shoes shop video thumbnail"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-2xl ring-4 ring-white/20 transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16">
                      <Play className="h-5 w-5 fill-current sm:h-8 sm:w-8" />
                    </span>
                  </span>
                  <span className="absolute bottom-3 left-3 right-3 hidden rounded-2xl bg-black/65 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-white backdrop-blur xs:block">
                    Watch the Shop Tour
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
