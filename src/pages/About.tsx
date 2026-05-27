const stats = [
  { n: "20+", l: "Years on the street" },
  { n: "11k", l: "Pairs fitted" },
  { n: "4.3", l: "Stars, and rising" },
];

const craft = [
  {
    t: "Genuine Quality",
    d: "Sourced, conditioned and stitched to last more than a season. We'd rather sell less than sell rubbish.",
  },
  {
    t: "Honest Fit",
    d: "We measure both feet. We'll tell you when a shoe doesn't suit you — even the ones we love.",
  },
  {
    t: "Open Door",
    d: "Browse for an hour, sit with a cup of tea, bring the whole family. The shop belongs to the street.",
  },
];

const About = () => (
  <div id="main-content" className="bg-background text-foreground">
    <section id="story" className="bg-secondary/60 grain">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-9 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-12 md:gap-16 lg:py-24">
        <div className="md:col-span-5 reveal-left">
          <p className="mb-3 text-xs tracking-[0.14em] text-muted-foreground sm:tracking-[0.16em]">§ 03 — Our Story</p>
          <h1 className="font-serif text-3xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            A shoe shop that remembers who you are.
          </h1>
        </div>

        <div className="space-y-6 text-base leading-7 text-foreground/80 sm:text-lg sm:leading-8 md:col-span-7 md:pl-10 reveal-right">
          <p>
            We opened on Jagatsundar Marg with a single shelf, a stool, and a radio that only played old Nepali songs. Two decades later — the radio is the same, the shelves are bigger, and somehow the same kids keep coming back, now with their own kids.
          </p>
          <p>
            We don't chase trends. We chase fit, finish, and feet that are happy walking from Patan to Boudha and back. Every pair on the shelf passed through hands that know what a sole should feel like.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-7 sm:gap-6 sm:pt-8">
            {stats.map((s, i) => (
              <div key={s.l} className="reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="font-serif text-3xl font-black text-primary sm:text-4xl">{s.n}</div>
                <div className="mt-1 text-[10px] leading-4 tracking-[0.08em] text-muted-foreground sm:text-xs">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section id="craft" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <p className="mb-3 text-xs tracking-[0.16em] text-muted-foreground reveal">§ 04 — The Craft</p>
      <h2 className="mb-8 max-w-3xl font-serif text-3xl font-black tracking-tight sm:mb-12 sm:text-5xl md:text-6xl reveal">
        Three things we refuse to compromise on.
      </h2>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm bg-border xs:grid-cols-3 reveal">
        {craft.map((item, i) => (
          <article
            key={item.t}
            className="group bg-card p-5 transition-colors duration-500 hover:bg-secondary/60 xs:p-4 sm:p-8 lg:p-10"
            style={{ transitionDelay: `${i * 140}ms` }}
          >
            <div className="font-serif text-5xl font-black text-mustard transition-transform duration-500 group-hover:-translate-y-1 xs:text-4xl sm:text-6xl">
              0{i + 1}
            </div>
            <h3 className="mt-5 font-serif text-xl font-bold leading-tight transition-colors duration-300 group-hover:text-primary xs:mt-4 xs:text-sm sm:mt-5 sm:text-2xl">
              {item.t}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground xs:text-[11px] xs:leading-5 sm:mt-3 sm:text-base sm:leading-7">{item.d}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
);

export default About;
