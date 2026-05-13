import { ScrollReveal } from '../components/ScrollReveal';
import SiteHeader from '../components/SiteHeader';

const About = () => (
  <>
      <SiteHeader />
  
      {/* ── Story ── */}
      <section id="story" className="bg-secondary/60 grain relative">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-50 top-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-50 bottom-1/4 w-96 h-96 bg-mustard/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }}></div>
        </div>

        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 gap-8 sm:gap-16 px-4 sm:px-6 py-16 sm:py-24 md:grid-cols-12 relative z-10">
          <div className="md:col-span-5 reveal-left">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">§ 03 — Our Story</p>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
              A shoe shop that <em className="text-primary not-italic">remembers</em> who you are.
            </h2>
          </div>
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-foreground/80 md:col-span-7 md:pl-10 reveal-right">
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
            <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6 border-t border-border pt-8">
              {[
                { n: "20+", l: "Years on the street" },
                { n: "11k", l: "Pairs fitted" },
                { n: "4.3", l: "Stars, and rising" },
              ].map((s, i) => (
                <div key={s.l} className="reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                  <div className="font-serif text-2xl sm:text-4xl font-black text-primary transition-transform duration-300 hover:scale-110 inline-block">{s.n}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Craft ── */}
      <section id="craft" className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 py-16 sm:py-24">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-40 -top-40 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        </div>

        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground reveal">§ 04 — The Craft</p>
        <h2 className="mb-8 sm:mb-14 max-w-3xl font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight reveal">
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

      {/* ── Signature Offerings ── */}
      <section className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 py-16 sm:py-24">
        {/* Background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -right-40 top-1/3 w-80 h-80 bg-primary/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -left-40 bottom-1/3 w-80 h-80 bg-mustard/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground reveal">§ 05 — Signature Offerings</p>
        <h2 className="mb-8 sm:mb-14 max-w-3xl font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight reveal">
          Services tailored for Kathmandu homes.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <ScrollReveal>
            <div className="group rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:bg-secondary/60 h-full flex flex-col">
              <div className="mb-4 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-primary">Deep comfort styling</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 flex-grow">Personalised shoe fitting and everyday comfort advice, tailored for Kathmandu feet.</p>
              <a href="#" className="text-primary font-medium text-sm sm:text-base hover:text-primary/80 transition-colors inline-block">Discuss this service →</a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="group rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:bg-secondary/60 h-full flex flex-col">
              <div className="mb-4 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-primary">Repair & care</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 flex-grow">Fast repair, polishing and fitting adjustments for shoes that you wear again and again.</p>
              <a href="#" className="text-primary font-medium text-sm sm:text-base hover:text-primary/80 transition-colors inline-block">Discuss this service →</a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="group rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:bg-secondary/60 h-full flex flex-col">
              <div className="mb-4 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
                </svg>
              </div>
              <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-primary">Curated collections</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 flex-grow">Branded releases, seasonal drops and local favourites arranged for easy browsing.</p>
              <a href="#" className="text-primary font-medium text-sm sm:text-base hover:text-primary/80 transition-colors inline-block">Discuss this service →</a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="group rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:bg-secondary/60 h-full flex flex-col">
              <div className="mb-4 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m0 0l-2-1m2 1v2.5M14 4l-2 1m0 0L10 4m2 1V2.5M4 7l2 1m0 0l2-1m-2 1v2.5" />
                </svg>
              </div>
              <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 transition-colors duration-300 group-hover:text-primary">Fresh shop displays</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 flex-grow">Clean presentation, seasonal looks and polished store styling for a premium visit.</p>
              <a href="#" className="text-primary font-medium text-sm sm:text-base hover:text-primary/80 transition-colors inline-block">Discuss this service →</a>
            </div>
          </ScrollReveal>
        </div>
      </section>
  
  
  </>
);

export default About;
