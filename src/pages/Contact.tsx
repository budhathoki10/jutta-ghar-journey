import { Link } from "react-router-dom";
import { Clock3, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { businessName, email, fullAddress, mapSrc, phoneHref, phoneNumber, whatsappLink } from "@/content/site";
import { useParallax } from "@/hooks/use-parallax";

const Contact = () => {
  const { ref: parallaxRef, offsetY } = useParallax(0.4);

  return (
    <main id="main-content" className="bg-background px-6 pb-24 pt-20 text-foreground sm:px-10">
      <div className="mx-auto max-w-7xl">
        <section ref={parallaxRef} className="grid gap-12 lg:grid-cols-[0.9fr_0.6fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Contact</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Schedule your visit or ask the shop a question.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Call {phoneNumber}, send a WhatsApp note, or use the form below. We reply during shop hours and hold reserved fitting slots for confirmed requests.
            </p>
            <div className="mt-10 grid gap-4 rounded-[32px] border border-border bg-surface p-6 shadow-card sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Phone</p>
                <a href={phoneHref} className="mt-3 block text-lg font-semibold text-foreground">{phoneNumber}</a>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="mt-2 block text-sm text-primary underline">Message on WhatsApp</a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Shop</p>
                <p className="mt-3 text-base text-foreground">{businessName}</p>
                <p className="mt-2 text-sm text-muted-foreground">{fullAddress}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="h-4 w-4" /> Open Monday – Saturday, 9:00 AM – 8:00 PM
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-4 rounded-[32px] border border-border bg-background/90 p-6 shadow-card">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary" />
                <span>Street-level entry with easy drop-off for taxi or tuk-tuk.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary" />
                <span>No spam. Your details are used only to confirm your appointment.</span>
              </div>
            </div>
          </div>

          <aside>
            <ContactForm />
          </aside>
        </section>

        <section className="mt-16 overflow-hidden rounded-[32px] border border-border bg-surface shadow-card">
          <iframe title="GoGo Jutta Ghar contact map" src={mapSrc} className="h-[420px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </section>

        <div className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
          <p>Need a privacy summary? See our <Link to="/privacy" className="text-primary underline">Privacy policy</Link>.</p>
        </div>
      </div>
    </main>
  );
};

export default Contact;
