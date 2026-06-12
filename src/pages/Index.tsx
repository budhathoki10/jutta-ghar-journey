import { useEffect, useRef, useState } from "react";
import { fetchShoes } from "@/api/shoeApi";
import { Button } from "@/components/ui/button";
import { useReveal } from "@/hooks/use-reveal";
import { handleProductImageError, resolveImageUrl } from "@/lib/image";
import type { Shoe } from "@/types/shoe";
import { MapPin, Phone, Clock, Star, ArrowUpRight, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import heroShoes from "@/assets/hero-shoes.jpg";

type CollectionCard = {
  id: string;
  name: string;
  category: string;
  img: string;
  trending?: boolean;
};

const googleMapsUrl = "https://www.google.com/maps/place/GoGo+Jutta+Ghar/@27.7082595,85.3093997,928m/data=!3m2!1e3!4b1!4m6!3m5!1s0x39eb18fe4cf62957:0x3054f9c0f5228fb0!8m2!3d27.7082548!4d85.31198!16s%2Fg%2F11d_d1vhp3?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D";

const services = [
  {
    title: "Deep comfort styling",
    description: "Personalised shoe fitting and everyday comfort advice, tailored for Kathmandu feet.",
  },
  {
    title: "Repair & care",
    description: "Fast repair, polishing and fitting adjustments for shoes that you wear again and again.",
  },
  {
    title: "Curated collections",
    description: "Branded releases, seasonal drops and local favourites arranged for easy browsing.",
  },
  {
    title: "Fresh shop displays",
    description: "Clean presentation, seasonal looks and polished store styling for a premium visit.",
  },
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
    color: "bg-primary/10",
  },
  {

    image: "https://scontent.fktm24-1.fna.fbcdn.net/v/t39.30808-6/686953937_122310874418232382_9126030449653839631_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_ohc=744F5AJXGycQ7kNvwHFgzZu&_nc_oc=Adp8iVYT5to2n9tKu4RMtKOjA35eYB41ULEbH92QIeOWsc5aojGIZw1R9yPNILTW1gY&_nc_zt=23&_nc_ht=scontent.fktm24-1.fna&_nc_gid=1xkgedYwQoysE7NJ5ahGRA&_nc_ss=7b2a8&oh=00_Af7DoyEAy15Iq08Xler361d5sD_JbIheNDWTfvyHTt0svA&oe=69FD5945",
    role: "Instagram Enquiries",
    phone: "9843183764",
    note: "Quick social support for product questions",
    purpose: "Instagram enquiries",
    actionLabel: "Connect on Instagram",
    actionHref: "https://www.instagram.com/gogo_juttaa_ghar?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    color: "bg-primary/10",
  },
  {

    image: "https://scontent.fktm24-1.fna.fbcdn.net/v/t39.30808-6/477789706_1488858768714955_8664295335267458868_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=7b2446&_nc_ohc=9tJZHMHe-v4Q7kNvwEiCuxr&_nc_oc=AdqbeNUJG2XHZN5ONpttCTami_QfNwxNbES7SLAC37Phwd78P38eV_cVskkYttr8PN0&_nc_zt=23&_nc_ht=scontent.fktm24-1.fna&_nc_gid=jELq07Yl-36Ug5sxOOqmMA&_nc_ss=7b2a8&oh=00_Af6Fql3Q_6Ny4DWYGXOmOs9efpyAPg-XT0Zc63bPIqxuPQ&oe=69FD6155",
    role: "WhatsApp Enquiries",
    phone: "9865481109",
    note: "Fast WhatsApp support for custom orders",
    purpose: "WhatsApp enquiries",
    actionLabel: "Chat on WhatsApp",
    actionHref: "https://wa.me/9779865481109",
    color: "bg-primary/10",
  },
];

const Index = () => {
  useReveal([]);

  const [playing, setPlaying] = useState(false);
  const videoId = "SZMr39NJ76A";
  const heroAlt = "GoGo Jutta Ghar business logo";
  const [collections, setCollections] = useState<CollectionCard[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

    fetchShoes()
      .then((res) => {
        const shoes = ((res.data.data || []) as Shoe[]).filter((shoe) => shoe.images?.length);

        const latestShoes = shoes
          .slice()
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );

        const uniqueLatestShoes = latestShoes.filter(
          (shoe, index, self) => self.findIndex((other) => other._id === shoe._id) === index
        );

        const selected = shuffle(uniqueLatestShoes.slice(0, 12)).slice(0, 5);
        const selectedCardData = selected.map((shoe) => ({
          id: shoe._id,
          name: shoe.name,
          category: `${shoe.gender ? `${shoe.gender.charAt(0).toUpperCase() + shoe.gender.slice(1)}` : 'Unisex'} · ${shoe.subcategory || 'Shoe'}`,
          img: resolveImageUrl(shoe.images[0].url),
          trending: Boolean(shoe.trending),
        }));

        setCollections(selectedCardData);
      })
      .catch(console.error)
      .finally(() => setIsLoadingCollections(false));

  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) =>
        collections.length ? (current + 1) % collections.length : 0
      );
    }, 6000);

    return () => window.clearInterval(interval);
  }, [collections.length]);

  useEffect(() => {
    const slider = sliderRef.current;
    const card = slider?.children[activeSlide] as HTMLElement | undefined;
    if (card) {
      slider.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
    }
  }, [activeSlide]);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── Hero ── */}
      <section id="home" className="relative overflow-hidden reveal">
        {/* Background Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="hero-shape hero-shape-3" />
          <div className="bubble bubble-1 bg-primary/10" style={{ left: "5%", top: "10%" }}></div>
          <div className="bubble bubble-2 bg-mustard/10" style={{ right: "10%", top: "5%" }}></div>
          <div className="bubble bubble-3 bg-primary/10" style={{ left: "20%", bottom: "15%" }}></div>
          <div className="bubble bubble-4 bg-mustard/10" style={{ right: "5%", bottom: "20%" }}></div>
          <div className="bubble bubble-5 bg-primary/10" style={{ left: "50%", top: "20%" }}></div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_minmax(150px,44vw)] items-start gap-4 px-4 py-10 xs:px-5 sm:gap-8 sm:px-6 sm:py-14 md:grid-cols-12 md:items-center md:py-24">
          <div className="min-w-0 md:col-span-6 md:pr-6">
            <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-muted-foreground reveal-left" style={{ transitionDelay: "0.05s" }}>
              <span className="h-px w-8 bg-foreground/40" />
              Vol. 01 · A Kathmandu Shoe House
            </div>
            <h1 className="font-serif text-[1.65rem] font-black leading-[1.04] tracking-tight text-balance xs:text-[1.9rem] sm:text-5xl md:text-6xl lg:text-7xl reveal-left" style={{ transitionDelay: "0.15s" }}>
              Shoes that <em className="not-italic text-primary">walk</em> the city,
              <br />
              <span className="text-foreground/80">made for Nepali feet.</span>
            </h1>
          </div>

          <div className="relative min-w-0 md:col-span-6 md:row-span-2 md:self-start md:pt-10 lg:pt-12 reveal-right" style={{ transitionDelay: "0.25s" }}>
            <div className="group relative mx-auto aspect-square w-full max-w-[14.5rem] overflow-hidden rounded-2xl bg-card shadow-soft sm:max-w-[24rem] md:max-w-[480px] md:rounded-[2rem]">
              <img
                src={heroShoes}
                alt={"Featured shoes collection"}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                width={1600}
                height={2000}
              />
              <div className="absolute bottom-3 left-3 right-3 hidden items-end justify-end text-ink-foreground sm:flex">
                <div className="hidden rounded-2xl bg-mustard px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-ink transition-transform duration-500 group-hover:-translate-y-1 sm:block">
                  New In
                </div>
              </div>
            </div>
            <div className="absolute -left-3 -top-4 flex h-16 w-16 rotate-[-8deg] items-center justify-center rounded-full bg-primary/10 text-center text-[12px] font-bold uppercase leading-tight tracking-widest text-primary shadow-card xs:-left-5 xs:-top-6 xs:h-20 xs:w-20 xs:text-sm md:-left-6 md:top-[-1.5rem] md:h-24 md:w-24 md:text-[18px] animate-float">
              20 %<br />off<br />
            </div>
          </div>

          <div className="col-span-2 md:col-span-6 md:col-start-1">
            <div className="mt-6 flex flex-wrap gap-3 reveal-left" style={{ transitionDelay: "0.25s" }}>
              {["Doctor shoes", "Heels", "Sports", "Boots", "High copy shoes"].map((type) => (
                <span key={type} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary xs:px-4 xs:py-2 xs:text-sm">
                  {type}
                </span>
              ))}
            </div>
            <p className="mt-6 max-w-md text-sm leading-6 text-muted-foreground sm:mt-8 sm:text-lg sm:leading-relaxed reveal-left" style={{ transitionDelay: "0.35s" }}>
              गोगो जुत्ता घर — the original shoe destination on Jagatsundar Marg, Kathmandu.
              Quality you can feel. Soles that survive monsoon. Service that remembers your name.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-2 text-xs xs:gap-3 xs:text-sm sm:gap-4 reveal-left" style={{ transitionDelay: "0.4s" }}>
              <div className="rounded-2xl border border-border bg-card p-3 xs:p-4 sm:rounded-3xl">
                <div className="flex items-center gap-2 text-primary"><MapPin className="h-4 w-4" /> GoGo Jutta Ghar</div>
                <div className="mt-2 text-foreground/80">Jagatsundar Marg, Kathmandu 44600</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-3 xs:p-4 sm:rounded-3xl">
                <div className="flex items-center gap-2 text-primary"><Clock className="h-4 w-4" /> Open daily</div>
                <div className="mt-2 text-foreground/80">9:00 AM – 8:00 PM</div>
              </div>
            </div>
            <div className="mt-6 grid gap-3 xs:grid-cols-2 sm:flex sm:flex-wrap sm:items-center reveal-left" style={{ transitionDelay: "0.5s" }}>
              <Button asChild size="lg" className="group h-12 w-full rounded-full bg-primary px-4 text-xs text-primary-foreground hover:bg-terracotta-deep transition-all duration-300 hover:scale-[1.03] hover:shadow-soft xs:text-sm sm:w-auto sm:px-7">
                <a className="w-full text-center" href="#collection">Browse Shoes <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="group h-12 w-full rounded-full border border-ink bg-background px-4 text-xs text-ink hover:border-primary hover:text-primary transition-all duration-300 hover:shadow-soft xs:text-sm sm:w-auto sm:px-7">
                <Link className="w-full text-center" to="/shop-floors">Tour Shop Floors</Link>
              </Button>
              <Button asChild size="lg" className="group h-12 w-full rounded-full bg-ink px-5 text-ink-foreground hover:bg-ink/90 transition-all duration-300 hover:scale-[1.02] xs:col-span-2 sm:w-auto sm:px-7">
                <a className="w-full text-center" href={googleMapsUrl} target="_blank" rel="noreferrer">View on Google Maps <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a>
              </Button>
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

      <section className="bg-background py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 xs:px-5 sm:px-6">
          <div className="rounded-2xl bg-card px-4 py-7 shadow-soft xs:px-5 xs:py-8 sm:rounded-[2rem] sm:px-6 sm:py-10 reveal">
            <p className="text-xs uppercase tracking-[0.22em] text-primary sm:text-sm sm:tracking-[0.35em]">Signature Offerings</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-ink xs:text-4xl">Services tailored for Kathmandu homes.</h2>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
              {services.map((service, index) => {
                const featured = index === 1;
                return (
                  <div
                    key={service.title}
                    className={`group relative flex min-h-[13.5rem] flex-col rounded-2xl border border-border p-4 shadow-sm transition duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-soft sm:min-h-[23rem] sm:rounded-[2rem] sm:p-8 ${
                      featured ? "bg-secondary/45" : "bg-white"
                    }`}
                  >
                    <span className="font-serif text-5xl font-black leading-none text-mustard sm:text-7xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="relative z-10 flex flex-1 flex-col">
                      <h3 className={`mt-7 text-sm font-semibold leading-tight xs:text-base sm:mt-12 sm:text-xl ${featured ? "text-primary" : "text-ink"}`}>{service.title}</h3>
                      <p className="mt-3 line-clamp-5 text-[11px] leading-5 text-foreground/70 xs:text-xs sm:mt-4 sm:text-sm sm:leading-6">{service.description}</p>
                      <div className="mt-auto pt-5 text-xs font-semibold text-primary xs:text-sm sm:pt-8">Discuss service →</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Collection ── */}
      <section id="collection" className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        {/* Subtle background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-40 -top-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-mustard/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-12 reveal">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:tracking-[0.25em]">§ 02 — The Shelf</p>
            <h2 className="font-serif text-3xl font-black tracking-tight sm:text-5xl md:text-6xl">This week, in store.</h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted-foreground md:block">
            A rotating selection of what just came in. Try them on — there's chai while you wait.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl">
          <div ref={sliderRef} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 xl:pb-8">
            {isLoadingCollections ? (
              <article className="snap-start flex-none w-[80vw] sm:w-[60vw] lg:w-[42vw] xl:w-[32rem] group relative overflow-hidden rounded-[1.5rem] bg-card shadow-card p-8">
                <div className="h-[28rem] rounded-[1.5rem] bg-slate-100" />
                <div className="mt-5 space-y-3">
                  <div className="h-4 w-40 rounded-full bg-slate-200" />
                  <div className="h-4 w-24 rounded-full bg-slate-200" />
                  <div className="h-3 w-60 rounded-full bg-slate-200" />
                </div>
              </article>
            ) : collections.length ? (
              collections.map((item, i) => (
                <article
                  key={item.id}
                  className="snap-start flex-none w-[80vw] sm:w-[60vw] lg:w-[42vw] xl:w-[32rem] group relative overflow-hidden rounded-[1.5rem] bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="aspect-[5/4] overflow-hidden bg-muted">
                    <img
                      src={item.img}
                      alt={`${item.name} ${item.trending ? 'trending shoe' : 'shoe'}`}
                      loading="lazy"
                      onError={handleProductImageError}
                      width={800}
                      height={1000}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px]">
                        {item.category}
                      </p>
                      <span className="rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ink shadow-sm">
                        № {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground sm:text-xl">
                      {item.name}
                    </h3>
                    {item.trending && (
                      <p className="text-sm text-muted-foreground">
                        Trending right now — the most requested pair in store.
                      </p>
                    )}
                  </div>
                </article>
              ))
            ) : (
              <article className="snap-start flex-none w-[80vw] sm:w-[60vw] lg:w-[42vw] xl:w-[32rem] group relative overflow-hidden rounded-[1.5rem] bg-card shadow-card p-8">
                <div className="h-[28rem] rounded-[1.5rem] bg-slate-100 grid place-items-center text-center px-6">
                  <div>
                    <p className="text-lg font-semibold text-ink">New arrivals will appear here.</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Add new shoes and they will automatically show in this section.
                    </p>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-2">
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
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" className="h-12 rounded-full bg-primary px-7 text-primary-foreground hover:bg-terracotta-deep">
            <a href="#contact">Contact for more details</a>
          </Button>
        </div>
      </section>



      {/* ── Story ── */}
      <section id="story" className="bg-background relative">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-50 top-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-50 bottom-1/4 w-96 h-96 bg-mustard/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }}></div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-9 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-12 md:gap-16 lg:py-24">
          <div className="md:col-span-5 reveal-left">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:tracking-[0.25em]">§ 03 — Our Story</p>
            <h2 className="font-serif text-3xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              A shoe shop that <em className="text-primary not-italic">remembers</em> who you are.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-foreground/80 sm:text-lg sm:leading-relaxed md:col-span-7 md:pl-10 reveal-right">
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
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-7 sm:gap-6 sm:pt-8">
              {[
                { n: "20+", l: "Years on the street" },
                { n: "11k", l: "Pairs fitted" },
                { n: "4.3", l: "Stars, and rising" },
              ].map((s, i) => (
                <div key={s.l} className="reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="inline-block font-serif text-3xl font-black text-primary transition-transform duration-300 hover:scale-110 sm:text-4xl">{s.n}</div>
                  <div className="mt-1 text-[10px] uppercase leading-4 tracking-[0.08em] text-muted-foreground sm:text-xs sm:tracking-widest">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Craft ── */}
      <section id="craft" className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-40 -top-40 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        </div>

        <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:tracking-[0.25em] reveal">§ 04 — The Craft</p>
        <h2 className="mb-8 max-w-3xl font-serif text-3xl font-black tracking-tight sm:mb-12 sm:text-5xl md:text-6xl reveal">
          Three things we refuse to compromise on.
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {[
            { t: "Genuine Quality", m: "Built to last.", d: "Sourced, conditioned and stitched to last more than a season. We'd rather sell less than sell rubbish." },
            { t: "Honest Fit", m: "Measured properly.", d: "We measure both feet. We'll tell you when a shoe doesn't suit you — even the ones we love." },
            { t: "Open Door", m: "Walk in anytime.", d: "Browse for an hour, sit with a cup of tea, bring the whole family. The shop belongs to the street." },
          ].map((c, i) => (
            <div key={c.t} className="group aspect-square overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:bg-secondary/60 hover:shadow-soft sm:aspect-auto sm:rounded-[1.75rem] sm:p-8 lg:p-10 reveal" style={{ transitionDelay: `${i * 140}ms` }}>
              <div className="font-serif text-3xl font-black leading-none text-mustard transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 sm:text-6xl">0{i + 1}</div>
              <h3 className="mt-3 font-serif text-[13px] font-bold leading-tight transition-colors duration-300 group-hover:text-primary sm:mt-6 sm:text-2xl">{c.t}</h3>
              <p className="mt-1 text-[10px] leading-4 text-muted-foreground sm:hidden">{c.m}</p>
              <p className="mt-3 hidden text-base leading-7 text-muted-foreground sm:block">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="relative bg-background py-14 sm:py-20 lg:py-24">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute left-0 bottom-0 w-96 h-96 bg-mustard/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2.5s" }}></div>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

          {/* Header */}
          <div className="mb-10 text-center sm:mb-12 reveal">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:tracking-[0.25em]">§ 05 — सम्पर्क · Contact</p>
            <h2 className="font-serif text-3xl font-black tracking-tight sm:text-5xl md:text-6xl">Talk directly with the team.</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              For direct orders, Instagram enquiries, and WhatsApp support — these are the people ready to help.
            </p>
          </div>

          {/* Store info cards */}
          <div className="mx-auto mb-10 grid max-w-2xl grid-cols-2 gap-3 sm:mb-12 sm:gap-4 lg:grid-cols-2 reveal">
            <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft sm:rounded-3xl sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs sm:tracking-[0.25em]">Store Line</p>
              <p className="mt-3 text-base font-semibold text-ink sm:text-2xl">+977 9841 898 731</p>
              <p className="mt-2 text-xs leading-5 text-foreground/70 sm:text-sm">Immediate orders & enquiries</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-soft sm:rounded-3xl sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs sm:tracking-[0.25em]">Visit</p>
              <p className="mt-3 text-base font-semibold text-ink sm:text-2xl">Jagatsundar Marg</p>
              <p className="mt-2 text-xs leading-5 text-foreground/70 sm:text-sm">Open daily · Walk-ins welcome</p>
            </div>
          </div>

          {/* Staff cards — 3 column grid */}
          <div className="grid gap-3 xs:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {staffContacts.map((contact, i) => (
              <div
                key={contact.role}
                className="group space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-lg sm:space-y-4 sm:rounded-[2rem] sm:p-6 reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Content */}
                <div>
                  <p className="text-[10px] uppercase leading-4 tracking-[0.08em] text-muted-foreground sm:text-xs sm:tracking-[0.25em]">{contact.role}</p>

                </div>
                <p className="text-xs leading-5 text-foreground/70 sm:text-sm">{contact.note}</p>
                <div className="space-y-2 border-t border-border pt-4 text-xs sm:text-sm">
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
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition-all duration-300 hover:bg-terracotta-deep hover:scale-[1.02] sm:px-4 sm:py-3 sm:text-sm"
                >
                  {contact.actionLabel}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Short ── */}
      <section id="video" className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20 lg:pb-16 lg:pt-24">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-40 -top-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_minmax(150px,46vw)] items-center gap-4 sm:gap-10 md:grid-cols-12 md:gap-20">

          <div className="min-w-0 space-y-3 sm:space-y-5 md:col-span-7 reveal-left">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.25em]">§ 06 — See the Shop</p>
            <h2 className="font-serif text-2xl font-black tracking-tight xs:text-3xl sm:text-5xl md:text-6xl">
              Step inside <em className="not-italic text-primary">GoGo</em> before you arrive.
            </h2>
            <p className="max-w-md text-xs leading-5 text-muted-foreground xs:text-sm sm:text-lg sm:leading-relaxed">
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
          <div className="mx-auto w-full max-w-[15.5rem] sm:max-w-[20rem] md:col-span-5 md:mx-0 md:max-w-[360px] reveal-right">
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-2xl ring-4 ring-white/20 transition-transform duration-300 hover:scale-110 sm:h-20 sm:w-20">
                      <svg className="h-5 w-5 translate-x-0.5 text-white sm:h-8 sm:w-8 sm:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Bottom label */}
                  <div className="absolute bottom-3 left-3 right-3 hidden rounded-2xl bg-black/60 px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-white backdrop-blur xs:block">
                    Watch the Shop Tour ▶
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* ── Visit ── */}
      <section id="visit" className="relative border-t border-border/80 bg-background py-14 sm:py-20 lg:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-32 top-8 h-72 w-72 rounded-full bg-mustard/10 blur-3xl animate-pulse"></div>
          <div className="absolute -left-32 bottom-4 h-72 w-72 rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="relative z-10 mx-auto mb-10 flex max-w-7xl items-center gap-4 px-4 sm:px-6">
          <span className="h-px flex-1 bg-border" />
          <span className="rounded-full border border-border bg-background px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
           Find us
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_minmax(150px,46vw)] items-center gap-4 px-4 sm:gap-10 sm:px-6 md:grid-cols-12 md:gap-20">
          <div className="min-w-0 space-y-4 md:col-span-7">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.25em]">§ 07 — Visit</p>
            <h2 className="font-serif text-2xl font-black leading-[1.08] tracking-tight xs:text-3xl sm:text-5xl md:text-6xl">
              Come in. <br /><em className="not-italic text-primary">Try a pair.</em>
            </h2>
            <p className="max-w-md text-xs leading-5 text-muted-foreground xs:text-sm sm:text-lg sm:leading-relaxed">
              We're easiest to find on foot. Look for the wooden door and the shoes drying outside.
            </p>
            <ul className="space-y-3 text-xs xs:text-sm sm:space-y-5 sm:text-base">
              <li className="group flex gap-4 transition-transform duration-300 hover:translate-x-1">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:scale-125 sm:h-5 sm:w-5" />
                <div className="min-w-0">
                  <div className="font-medium text-ink">Jagatsundar Marg</div>
                  <div className="text-muted-foreground">P856+3Q9, Kathmandu 44600</div>
                </div>
              </li>
              <li className="group flex gap-4 transition-transform duration-300 hover:translate-x-1">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:rotate-12 sm:h-5 sm:w-5" />
                <div className="min-w-0">
                  <div className="font-medium text-ink">Open every day</div>
                  <div className="text-muted-foreground">9:00 AM - 8:00 PM</div>
                </div>
              </li>
              <li className="hidden gap-4 transition-transform duration-300 hover:translate-x-1 sm:flex">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-125" />
                <div className="min-w-0">
                  <div className="font-medium text-ink">Walk in or message</div>
                  <div className="text-muted-foreground">No appointment needed</div>
                </div>
              </li>
            </ul>
            <Button asChild size="lg" className="group h-11 rounded-full bg-primary px-5 text-xs text-primary-foreground hover:bg-terracotta-deep sm:h-12 sm:px-7 sm:text-sm">
              <a href={googleMapsUrl} target="_blank" rel="noreferrer">
                Get Directions <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Button>
          </div>

          <div className="mx-auto w-full max-w-[16rem] sm:max-w-[22rem] md:col-span-5 md:mx-0 md:max-w-[480px]">
            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card p-2 shadow-soft ring-1 ring-border sm:p-3 md:rounded-[2rem]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#f5efe6] md:rounded-[1.5rem]">
                <iframe
                  title="GoGo Jutta Ghar map"
                  src="https://maps.google.com/maps?q=Jagatsundar%20Marg%20Kathmandu%20Nepal&z=17&output=embed"
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex items-center justify-between gap-3 px-2 py-3 text-xs sm:px-3 sm:text-sm">
                <span className="font-semibold text-ink">GoGo Jutta Ghar location</span>
                <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="shrink-0 font-semibold text-primary hover:underline">
                  Open map
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
