import { useEffect, useRef, useState } from "react";
import heroShoes from "@/assets/hero-shoes.jpg";
import shoeOxford from "@/assets/shoe-oxford.jpg";
import shoeHeels from "@/assets/shoe-heels.jpg";
import shoeSneaker from "@/assets/shoe-sneaker.jpg";
import shoeLoafer from "@/assets/shoe-loafer.jpg";
import shopImage from "@/assets/shop.png";
import { fetchShoes } from "@/api/shoeApi";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, ArrowUpRight } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { Link } from "react-router-dom";

const collections = [
  { id: "trending", name: "Trending Now", category: "Trending · Popular", img: heroShoes, trending: true },
  { id: "oxford", name: "Heritage Oxford", category: "Men · Formal", img: shoeOxford },
  { id: "heels", name: "Velvet Burgundy", category: "Women · Heels", img: shoeHeels },
  { id: "sneaker", name: "Cream Court", category: "Unisex · Sneakers", img: shoeSneaker },
  { id: "loafer", name: "Tassel Loafer", category: "Men · Casual", img: shoeLoafer },
  { id: "storefront", name: "Street Display", category: "Shop · Window", img: shopImage },
];

const staffContacts = [
  {
    image: "https://scontent.fktm24-1.fna.fbcdn.net/v/t39.30808-6/510969738_10036596226424282_5811402459633255473_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=ocqfnk_oPnAQ7kNvwGWtWd7&_nc_oc=AdrFzQ9HJAmaRNIzkC88_psgS4HryrNMvgxH0tC0GpzRywFZQ5GHm5wNImLH1UyLgqw&_nc_zt=23&_nc_ht=scontent.fktm24-1.fna&_nc_gid=jFUAJFQUVpcmaZGIiVrrVA&_nc_ss=7b2a8&oh=00_Af5UBSR-Vk-3hrPvBU3LuBqtdHRsQJUdBLD98EXWuCRTJA&oe=69FD4C98",
    role: "GoGo Shoes Owner",
    phone: "9841898731",
    note: "Available all time at the shop",
    purpose: "Direct orders and shop enquiries",
    actionLabel: "Connect on TikTok",
    actionHref: "https://www.tiktok.com/@kceybalaram?is_from_webapp=1&sender_device=pc",
    color: "bg-mustard/10",
  },
  {

    image: "https://scontent.fktm24-1.fna.fbcdn.net/v/t39.30808-6/686953937_122310874418232382_9126030449653839631_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_ohc=744F5AJXGycQ7kNvwHFgzZu&_nc_oc=Adp8iVYT5to2n9tKu4RMtKOjA35eYB41ULEbH92QIeOWsc5aojGIZw1R9yPNILTW1gY&_nc_zt=23&_nc_ht=scontent.fktm24-1.fna&_nc_gid=1xkgedYwQoysE7NJ5ahGRA&_nc_ss=7b2a8&oh=00_Af7DoyEAy15Iq08Xler361d5sD_JbIheNDWTfvyHTt0svA&oe=69FD5945",
    role: "Instagram Enquiries",
    phone: "9843183764",
    note: "Quick social support for product questions",
    purpose: "Instagram enquiries",
    actionLabel: "Connect on Instagram",
    actionHref: "https://www.instagram.com/gogo_juttaa_ghar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    color: "bg-pink-50",
  },
  {

    image: "https://scontent.fktm24-1.fna.fbcdn.net/v/t39.30808-6/477789706_1488858768714955_8664295335267458868_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=7b2446&_nc_ohc=9tJZHMHe-v4Q7kNvwEiCuxr&_nc_oc=AdqbeNUJG2XHZN5ONpttCTami_QfNwxNbES7SLAC37Phwd78P38eV_cVskkYttr8PN0&_nc_zt=23&_nc_ht=scontent.fktm24-1.fna&_nc_gid=jELq07Yl-36Ug5sxOOqmMA&_nc_ss=7b2a8&oh=00_Af6Fql3Q_6Ny4DWYGXOmOs9efpyAPg-XT0Zc63bPIqxuPQ&oe=69FD6155",
    role: "WhatsApp Enquiries",
    phone: "9865481109",
    note: "Fast WhatsApp support for custom orders",
    purpose: "WhatsApp enquiries",
    actionLabel: "Chat on WhatsApp",
    actionHref: "https://wa.me/9779865481109",
    color: "bg-green-50",
  },
];

const Index = () => {
  const [playing, setPlaying] = useState(false);
  const videoId = "SZMr39NJ76A";
  const [activeSlide, setActiveSlide] = useState(0);
  const [trendingImage, setTrendingImage] = useState<string>(heroShoes);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useReveal();

  useEffect(() => {
    fetchShoes()
      .then((res) => {
        const trending = (res.data.data || []).filter((shoe: any) => shoe.trending && shoe.images?.length);
        if (trending.length) {
          const random = trending[Math.floor(Math.random() * trending.length)];
          setTrendingImage(random.images[0].url);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % collections.length);
    }, 2000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    const card = slider?.children[activeSlide] as HTMLElement | undefined;
    if (card) {
      slider.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }
  }, [activeSlide]);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Hero ── */}
      <section id="home" className="relative overflow-hidden reveal">
        {/* Background Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="bubble bubble-1" style={{ left: "5%", top: "10%", background: "radial-gradient(circle at 30% 30%, rgba(0, 120, 200, 0.15), rgba(0, 120, 200, 0.05))" }}></div>
          <div className="bubble bubble-2" style={{ right: "10%", top: "5%", background: "radial-gradient(circle at 30% 30%, rgba(255, 100, 50, 0.1), rgba(255, 100, 50, 0.02))" }}></div>
          <div className="bubble bubble-3" style={{ left: "20%", bottom: "15%", background: "radial-gradient(circle at 30% 30%, rgba(255, 180, 0, 0.12), rgba(255, 180, 0, 0.03))" }}></div>
          <div className="bubble bubble-4" style={{ right: "5%", bottom: "20%", background: "radial-gradient(circle at 30% 30%, rgba(200, 50, 50, 0.08), rgba(200, 50, 50, 0.02))" }}></div>
          <div className="bubble bubble-5" style={{ left: "50%", top: "20%", background: "radial-gradient(circle at 30% 30%, rgba(100, 200, 100, 0.1), rgba(100, 200, 100, 0.03))" }}></div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 md:py-24 relative z-10">
          <div className="md:col-span-6 md:pr-6">
            <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground reveal-left" style={{ transitionDelay: "0.05s" }}>
              <span className="h-px w-8 bg-foreground/40" />
              Vol. 01 · A Kathmandu Shoe House
            </div>
            <h1 className="font-serif text-[clamp(2rem,6vw,4.5rem)] font-black leading-[0.92] tracking-tight text-balance reveal-left" style={{ transitionDelay: "0.15s" }}>
              Shoes that <em className="not-italic text-primary">walk</em> the city,
              <br />
              <span className="text-foreground/80">made for Nepali feet.</span>
            </h1>
            <div className="mt-6 flex flex-wrap gap-3 reveal-left" style={{ transitionDelay: "0.25s" }}>
              {["Oxfords", "Heels", "Sneakers", "Loafers", "Casuals"].map((type) => (
                <span key={type} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/30">
                  {type}
                </span>
              ))}
            </div>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground reveal-left" style={{ transitionDelay: "0.35s" }}>
              गोगो जुत्ता घर — a small, stubbornly good shoe store on Jagatsundar Marg.
              Quality you can feel. Soles that survive monsoon. Service that remembers your name.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 reveal-left" style={{ transitionDelay: "0.5s" }}>
              <Button asChild size="lg" className="group h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-terracotta-deep transition-all duration-300 hover:scale-[1.03] hover:shadow-soft">
                <a href="#collection">Browse the Collection <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="group h-12 rounded-full border border-ink bg-background text-ink hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-soft">
                <Link to="/shop-floors">Tour Shop Floors</Link>
              </Button>
              <a href="#visit" className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest">
                <span className="border-b border-foreground/40 pb-0.5 group-hover:border-primary">Walk in today</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
            <div className="mt-12 flex items-center gap-6 text-sm reveal-left" style={{ transitionDelay: "0.7s" }}>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-mustard text-mustard" />)}
                <Star className="h-4 w-4 fill-mustard/50 text-mustard" />
              </div>
              <span className="font-medium">4.3 on Google</span>
              <span className="text-muted-foreground">· loved by locals</span>
            </div>
          </div>

          <div className="relative md:col-span-6 reveal-right" style={{ transitionDelay: "0.25s" }}>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-sm shadow-soft">
              <img
                src={heroShoes}
                alt="Premium leather oxford and tan loafer on warm terracotta backdrop"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] rounded-xl"
                width={1600}
                height={2000}
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-ink-foreground">
                <div className="rounded-sm bg-ink/80 px-3 py-2 text-xs uppercase tracking-[0.2em] backdrop-blur transition-transform duration-500 group-hover:-translate-y-1">
                  Featured · Heritage Line
                </div>
                <div className="rounded-sm bg-mustard px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-ink transition-transform duration-500 group-hover:-translate-y-1 ">
                  New In
                </div>
              </div>
            </div>
            <div className="text-red-600 absolute -left-6 -top-6 hidden h-24 w-24 rotate-[-8deg] items-center justify-center rounded-full bg-mustard text-center text-[18px] font-bold uppercase leading-tight tracking-widest text-ink shadow-card md:flex animate-float">
              20 %<br />off<br />
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-y border-border/60 bg-ink py-5 text-ink-foreground overflow-hidden">
          <div className="marquee flex w-max gap-12 whitespace-nowrap font-serif text-3xl italic">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex gap-12">
                {["जुत्ता घर", "Kathmandu", "Quality", "Comfort", "गोगो", "Fit", "Nepal", "Since Day One"].map((w, i) => (
                  <span key={i} className="flex items-center gap-12">
                    {w} <span className="text-mustard">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collection ── */}
      <section id="collection" className="relative mx-auto max-w-7xl px-6 py-24">
        {/* Subtle background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-40 -top-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-mustard/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="mb-12 flex items-end justify-between gap-6 reveal">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">§ 02 — The Shelf</p>
            <h2 className="font-serif text-5xl font-black tracking-tight md:text-6xl">This week, in store.</h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            A rotating selection of what just came in. Try them on — there's chai while you wait.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl">
          <div ref={sliderRef} className="flex gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory rounded-xl">
            {collections.map((item, i) => (
              <article
                key={item.name}
                className="snap-start flex-none w-full sm:w-[min(38vw,32rem)] lg:w-[24rem] group reveal relative overflow-hidden rounded-sm bg-card shadow-card transition-all duration-500 hover:-translate-y-2 hover:shadow-soft"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="aspect-[11/14] overflow-hidden bg-muted">
                  <img
                    src={item.trending ? trendingImage : item.img}
                    alt={item.trending ? `${item.name} trending shoe` : item.name}
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
                </div>
                <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur transition-all duration-500 group-hover:bg-mustard group-hover:text-ink">
                  №&nbsp;{String(i + 1).padStart(2, "0")}
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-t from-ink/20 to-transparent transition-all duration-500 group-hover:h-1/3" />
              </article>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {collections.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${index === activeSlide ? "bg-primary" : "bg-muted-foreground/70 hover:bg-primary"}`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-terracotta-deep">
            <a href="#contact">Contact for more details</a>
          </Button>
        </div>
      </section>



      {/* ── Story ── */}
      <section id="story" className="bg-secondary/60 grain relative">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-50 top-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-50 bottom-1/4 w-96 h-96 bg-mustard/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }}></div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-24 md:grid-cols-12 relative z-10">
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

      {/* ── Craft ── */}
      <section id="craft" className="relative mx-auto max-w-7xl px-6 py-24">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-40 -top-40 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        </div>

        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground reveal">§ 04 — The Craft</p>
        <h2 className="mb-14 max-w-3xl font-serif text-5xl font-black tracking-tight md:text-6xl reveal">
          Three things we refuse to compromise on.
        </h2>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-border md:grid-cols-3">
          {[
         { t: "Genuine Quality", d: "Sourced, conditioned and stitched to last more than a season. We'd rather sell less than sell rubbish." },
            { t: "Honest Fit", d: "We measure both feet. We'll tell you when a shoe doesn't suit you — even the ones we love." },
            { t: "Open Door", d: "Browse for an hour, sit with a cup of tea, bring the whole family. The shop belongs to the street." },
          ].map((c, i) => (
            <div key={c.t} className="group bg-card p-10 reveal transition-colors duration-500 hover:bg-secondary/60" style={{ transitionDelay: `${i * 140}ms` }}>
              <div className="font-serif text-6xl font-black text-mustard transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">0{i + 1}</div>
              <h3 className="mt-6 font-serif text-2xl font-bold transition-colors duration-300 group-hover:text-primary">{c.t}</h3>
              <p className="mt-3 text-muted-foreground">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="bg-secondary/30 py-24 relative">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute left-0 bottom-0 w-96 h-96 bg-mustard/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2.5s" }}></div>
        </div>

        <div className="mx-auto max-w-7xl px-6 relative z-10">

          {/* Header */}
          <div className="mb-12 text-center reveal">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">§ 05 — सम्पर्क · Contact</p>
            <h2 className="font-serif text-5xl font-black tracking-tight md:text-6xl">Talk directly with the team.</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              For direct orders, Instagram enquiries, and WhatsApp support — these are the people ready to help.
            </p>
          </div>

          {/* Store info cards */}
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl mx-auto reveal">
            <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Store Line</p>
              <p className="mt-3 text-2xl font-semibold text-ink">+977 9841 898 731</p>
              <p className="mt-2 text-sm text-foreground/70">Immediate orders & enquiries</p>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-soft">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Visit</p>
              <p className="mt-3 text-2xl font-semibold text-ink">Jagatsundar Marg</p>
              <p className="mt-2 text-sm text-foreground/70">Open daily · Walk-ins welcome</p>
            </div>
          </div>

          {/* Staff cards — 3 column grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {staffContacts.map((contact, i) => (
              <div
   
                className="group reveal rounded-[2rem] border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lg p-6 space-y-4"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Content */}
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{contact.role}</p>

                </div>
                <p className="text-sm text-foreground/70">{contact.note}</p>
                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <p className="text-muted-foreground">{contact.purpose}</p>
                  <p>
                    <span className="font-semibold">Phone: </span>
                    <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="text-primary hover:underline">
                      {contact.phone}
                    </a>
                  </p>
                </div>
                
                <a href={contact.actionHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-terracotta-deep hover:scale-[1.02]"
                >
                  {contact.actionLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Short ── */}
      <section id="video" className="relative mx-auto max-w-7xl px-6 py-24">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-40 -top-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:gap-20 relative z-10">

          <div className="flex-1 space-y-5 reveal-left">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">§ 06 — See the Shop</p>
            <h2 className="font-serif text-5xl font-black tracking-tight md:text-6xl">
              Step inside <em className="not-italic text-primary">GoGo</em> before you arrive.
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              A quick look at the shop, the shelves, and the people behind the counter — straight from our social media.
            </p>
            
             <a href={`https://youtube.com/shorts/${videoId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Watch on YouTube <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Video player */}
          <div className="w-full max-w-[300px] mx-auto md:mx-0 reveal-right">
            <div className="aspect-[9/16] overflow-hidden rounded-[2rem] bg-black shadow-soft ring-1 ring-border">
              {playing ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                  title="GoGo Shoes Shop"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              ) : (
                <div className="relative h-full w-full cursor-pointer" onClick={() => setPlaying(true)}>
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                    alt="GoGo Shoes shop video thumbnail"
                    className="h-full w-full object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 shadow-2xl ring-4 ring-white/20 transition-transform duration-300 hover:scale-110">
                      <svg className="h-8 w-8 translate-x-1 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Bottom label */}
                  <div className="absolute bottom-5 left-4 right-4 rounded-2xl bg-black/60 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-white backdrop-blur">
                    Watch the Shop Tour ▶
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── Visit ── */}
      <section id="visit" className="bg-ink text-ink-foreground relative">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-50 top-1/4 w-96 h-96 bg-mustard/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-50 bottom-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }}></div>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-12 relative z-10">
          <div className="md:col-span-5 reveal-left">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-mustard">§ 07 — Visit</p>
            <h2 className="font-serif text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Come in. <br /><em className="not-italic text-mustard">Try a pair.</em>
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-foreground/70">
              We're easiest to find on foot. Look for the wooden door and the shoes drying outside.
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
              <a href="https://www.google.com/maps/place/GoGo+Jutta+Ghar/@27.7082548,85.31198,17z" target="_blank" rel="noreferrer">
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

      {/* ── Footer ── */}
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