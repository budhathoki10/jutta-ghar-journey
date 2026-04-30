import { useEffect, useState } from "react";
import heroShoes from "@/assets/hero-shoes.jpg";
import shoeOxford from "@/assets/shoe-oxford.jpg";
import shoeHeels from "@/assets/shoe-heels.jpg";
import shoeSneaker from "@/assets/shoe-sneaker.jpg";
import shoeLoafer from "@/assets/shoe-loafer.jpg";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, ArrowUpRight, ShoppingBag, Plus } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const collections = [
  { id: "oxford", name: "Heritage Oxford", category: "Men · Formal", price: 4800, img: shoeOxford },
  { id: "heels", name: "Velvet Burgundy", category: "Women · Heels", price: 5200, img: shoeHeels },
  { id: "sneaker", name: "Cream Court", category: "Unisex · Sneakers", price: 3900, img: shoeSneaker },
  { id: "loafer", name: "Tassel Loafer", category: "Men · Casual", price: 4400, img: shoeLoafer },
];

const Index = () => {
  const [time, setTime] = useState("");
  useReveal();
  const { add, count } = useCart();
  useEffect(() => {
    const tick = () => {
      const d = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Kathmandu",
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(d + " KTM");
    };
    tick();
    const i = setInterval(tick, 30000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="border-b border-border/60 bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-[11px] uppercase tracking-[0.2em]">
          <span>Est. Kathmandu · Nepal</span>
          <span className="hidden sm:block">Free fitting · Hand-finished leather · Since the bazaar days</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-mustard animate-blink" />
            {time}
          </span>
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="group flex items-baseline gap-2 transition-transform duration-300 hover:-translate-y-0.5">
            <span className="font-serif text-2xl font-black tracking-tight">GoGo</span>
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-primary">Jutta Ghar</span>
          </a>
          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <a href="#collection" className="link-underline hover:text-primary transition-colors">Collection</a>
            <a href="#story" className="link-underline hover:text-primary transition-colors">Our Story</a>
            <a href="#craft" className="link-underline hover:text-primary transition-colors">Craft</a>
            <a href="#visit" className="link-underline hover:text-primary transition-colors">Visit</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/checkout"
              aria-label="Open cart"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground animate-scale-in">
                  {count}
                </span>
              )}
            </Link>
            <Button asChild variant="default" className="rounded-full bg-ink text-ink-foreground hover:bg-ink/90 transition-all duration-300 hover:scale-105 hover:shadow-card">
              <a href="#visit">Find the Shop</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-6 md:pr-6">
            <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground animate-fade-in" style={{ animationDelay: "0.05s" }}>
              <span className="h-px w-8 bg-foreground/40" />
              Vol. 01 · A Kathmandu Shoe House
            </div>
            <h1 className="font-serif text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.92] tracking-tight text-balance animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
              Shoes that <em className="not-italic text-primary">walk</em> the city,
              <br />
              <span className="text-foreground/80">made for Nepali feet.</span>
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
              गोगो जुत्ता घर — a small, stubbornly good shoe store on Jagatsundar Marg.
              Leather you can smell. Soles that survive monsoon. Service that
              remembers your name.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              <Button asChild size="lg" className="group h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-terracotta-deep transition-all duration-300 hover:scale-[1.03] hover:shadow-soft">
                <a href="#collection">Browse the Collection <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
              </Button>
              <a href="#visit" className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
                <span className="border-b border-foreground/40 pb-0.5 group-hover:border-primary">Walk in today</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
            <div className="mt-12 flex items-center gap-6 text-sm animate-fade-in" style={{ animationDelay: "0.7s" }}>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-mustard text-mustard" />)}
                <Star className="h-4 w-4 fill-mustard/50 text-mustard" />
              </div>
              <span className="font-medium">4.3 on Google</span>
              <span className="text-muted-foreground">· loved by locals</span>
            </div>
          </div>

          <div className="relative md:col-span-6 animate-scale-in" style={{ animationDelay: "0.25s" }}>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-sm shadow-soft">
              <img
                src={heroShoes}
                alt="Premium leather oxford and tan loafer on warm terracotta backdrop"
                className="h-full w-full object-cover animate-kenburns transition-transform duration-700 group-hover:scale-[1.04]"
                width={1600}
                height={2000}
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-ink-foreground">
                <div className="rounded-sm bg-ink/80 px-3 py-2 text-xs uppercase tracking-[0.2em] backdrop-blur transition-transform duration-500 group-hover:-translate-y-1">
                  Featured · Heritage Line
                </div>
                <div className="rounded-sm bg-mustard px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-ink transition-transform duration-500 group-hover:-translate-y-1">
                  New In
                </div>
              </div>
            </div>
            <div className="absolute -left-6 -top-6 hidden h-24 w-24 rotate-[-8deg] items-center justify-center rounded-full bg-mustard text-center text-[10px] font-bold uppercase leading-tight tracking-widest text-ink shadow-card md:flex animate-float">
              Hand
              <br />
              Finished
              <br />
              ◆ Nepal
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-y border-border/60 bg-ink py-5 text-ink-foreground overflow-hidden">
          <div className="marquee flex w-max gap-12 whitespace-nowrap font-serif text-3xl italic">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12">
                {["Leather", "Suede", "Canvas", "Comfort", "Craft", "Kathmandu", "गोगो", "Since Day One"].map((w, i) => (
                  <span key={i} className="flex items-center gap-12">
                    {w} <span className="text-mustard">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection */}
      <section id="collection" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between gap-6 reveal">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">§ 02 — The Shelf</p>
            <h2 className="font-serif text-5xl font-black tracking-tight md:text-6xl">This week, in store.</h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            A rotating selection of what just came in. Try them on — there's chai while you wait.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((item, i) => (
            <article
              key={item.name}
              className="group reveal relative overflow-hidden rounded-sm bg-card shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-soft"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={item.img}
                  alt={item.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110 group-hover:rotate-[0.5deg]"
                />
              </div>
              <div className="flex items-center justify-between p-5 transition-colors duration-300 group-hover:bg-secondary/40">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.category}</p>
                  <h3 className="mt-1 font-serif text-xl font-bold transition-colors duration-300 group-hover:text-primary">{item.name}</h3>
                </div>
                <span className="font-medium tabular-nums">Rs. {item.price.toLocaleString()}</span>
              </div>
              <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur transition-all duration-500 group-hover:bg-mustard group-hover:text-ink">
                №&nbsp;{String(i + 1).padStart(2, "0")}
              </div>
              <button
                type="button"
                onClick={() => {
                  add({ id: item.id, name: item.name, category: item.category, price: item.price, img: item.img });
                  toast.success(`${item.name} added to bag`);
                }}
                aria-label={`Add ${item.name} to cart`}
                className="absolute bottom-20 right-3 inline-flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-ink text-ink-foreground opacity-0 shadow-card transition-all duration-300 hover:scale-110 hover:bg-primary group-hover:translate-y-0 group-hover:opacity-100"
              >
                <Plus className="h-4 w-4" />
              </button>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-ink/20 to-transparent transition-all duration-500 group-hover:h-1/3" />
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-terracotta-deep">
            <Link to="/checkout">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Go to checkout {count > 0 && `· ${count} item${count > 1 ? "s" : ""}`}
            </Link>
          </Button>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="bg-secondary/60 grain">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-24 md:grid-cols-12">
          <div className="md:col-span-5 reveal-left">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">§ 03 — Our Story</p>
            <h2 className="font-serif text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              A shoe shop that <em className="text-primary not-italic">remembers</em> who you are.
            </h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-foreground/80 md:col-span-7 md:pl-10 reveal-right">
            <p>
              We opened on Jagatsundar Marg with a single shelf, a stool, and a radio that
              only played old Nepali songs. Two decades later — the radio is the same, the shelves
              are bigger, and somehow the same kids keep coming back, now with their own kids.
            </p>
            <p>
              We don't chase trends. We chase fit, finish, and feet that are happy walking
              from Patan to Boudha and back. Every pair on the shelf passed through hands
              that know what a sole should feel like.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { n: "20+", l: "Years on the street" },
                { n: "11k", l: "Pairs fitted" },
                { n: "4.3", l: "Stars, and rising" },
              ].map((s, i) => (
                <div key={s.l} className="reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="font-serif text-4xl font-black text-primary transition-transform duration-300 hover:scale-110 inline-block">{s.n}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Craft / values */}
      <section id="craft" className="mx-auto max-w-7xl px-6 py-24">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground reveal">§ 04 — The Craft</p>
        <h2 className="mb-14 max-w-3xl font-serif text-5xl font-black tracking-tight md:text-6xl reveal">
          Three things we refuse to compromise on.
        </h2>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-border md:grid-cols-3">
          {[
            { t: "Real Leather", d: "Sourced, conditioned and stitched to last more than a season. We'd rather sell less than sell rubbish." },
            { t: "Honest Fit", d: "We measure both feet. We'll tell you when a shoe doesn't suit you — even the ones we love." },
            { t: "Open Door", d: "Browse for an hour, sit with a cup of tea, bring the whole family. The shop belongs to the street." },
          ].map((c, i) => (
            <div
              key={c.t}
              className="group bg-card p-10 reveal transition-colors duration-500 hover:bg-secondary/60"
              style={{ transitionDelay: `${i * 140}ms` }}
            >
              <div className="font-serif text-6xl font-black text-mustard transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">0{i + 1}</div>
              <h3 className="mt-6 font-serif text-2xl font-bold transition-colors duration-300 group-hover:text-primary">{c.t}</h3>
              <p className="mt-3 text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className="bg-ink text-ink-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-12">
          <div className="md:col-span-5 reveal-left">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-mustard">§ 05 — Visit</p>
            <h2 className="font-serif text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Come in. <br /><em className="not-italic text-mustard">Try a pair.</em>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-foreground/70">
              We're easiest to find on foot. Look for the wooden door and the
              shoes drying outside.
            </p>

            <ul className="mt-10 space-y-5 text-base">
              <li className="group flex gap-4 transition-transform duration-300 hover:translate-x-1">
                <MapPin className="mt-1 h-5 w-5 text-mustard transition-transform duration-300 group-hover:scale-125" />
                <div>
                  <div className="font-medium">Jagatsundar Marg</div>
                  <div className="text-ink-foreground/60">P856+3Q9, Kathmandu 44600, Nepal</div>
                </div>
              </li>
              <li className="group flex gap-4 transition-transform duration-300 hover:translate-x-1">
                <Clock className="mt-1 h-5 w-5 text-mustard transition-transform duration-300 group-hover:rotate-12" />
                <div>
                  <div className="font-medium">Open every day</div>
                  <div className="text-ink-foreground/60">9:00 AM – 8:00 PM</div>
                </div>
              </li>
              <li className="group flex gap-4 transition-transform duration-300 hover:translate-x-1">
                <Phone className="mt-1 h-5 w-5 text-mustard transition-transform duration-300 group-hover:scale-125" />
                <div>
                  <div className="font-medium">Walk in or message</div>
                  <div className="text-ink-foreground/60">No appointment needed</div>
                </div>
              </li>
            </ul>

            <Button asChild size="lg" className="group mt-10 h-12 rounded-full bg-mustard px-7 text-ink hover:bg-mustard/90 transition-all duration-300 hover:scale-105 hover:shadow-soft">
              <a
                href="https://www.google.com/maps/place/GoGo+Jutta+Ghar/@27.7082548,85.31198,17z"
                target="_blank"
                rel="noreferrer"
              >
                Get Directions <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Button>
          </div>

          <div className="md:col-span-7 reveal-right">
            <div className="overflow-hidden rounded-sm border border-ink-foreground/10 shadow-soft transition-transform duration-500 hover:scale-[1.01]">
              <iframe
                title="GoGo Jutta Ghar location"
                src="https://www.google.com/maps?q=27.7082548,85.31198&z=17&output=embed"
                className="h-[460px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-black">GoGo</span>
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Jutta Ghar · est. Kathmandu</span>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            © {new Date().getFullYear()} — Made with chai on Jagatsundar Marg
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
