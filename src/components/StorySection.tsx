import { ScrollReveal } from '@/components/ScrollReveal';

const StorySection = () => (
  <section id="story" className="py-16 md:py-24 px-6 bg-gradient-to-b from-terracotta/5 to-transparent">
    <div className="mx-auto max-w-4xl">
      <ScrollReveal>
        <div className="space-y-4 mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">§ 03 — Our Story</p>
          <h2 className="text-5xl font-black leading-tight text-ink">A shoe shop that remembers who you are.</h2>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="space-y-6 mb-12">
          <p className="text-lg leading-relaxed text-foreground">
            We opened on Jagatsundar Marg with a single shelf, a stool, and a radio that only played old Nepali songs. Two decades later — the radio is the same, the shelves are bigger, and somehow the same kids keep coming back, now with their own kids.
          </p>
          <p className="text-lg leading-relaxed text-foreground">
            We don't chase trends. We chase fit, finish, and feet that are happy walking from Patan to Boudha and back. Every pair on the shelf passed through hands that know what a sole should feel like.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="grid gap-8 sm:grid-cols-3 py-8 mb-12">
          <div className="rounded-xl bg-terracotta/10 p-6 text-center">
            <p className="text-4xl font-black text-ink">20+</p>
            <p className="mt-2 text-sm text-foreground/70">Years on the street</p>
          </div>
          <div className="rounded-xl bg-primary/10 p-6 text-center">
            <p className="text-4xl font-black text-ink">11k</p>
            <p className="mt-2 text-sm text-foreground/70">Pairs fitted</p>
          </div>
          <div className="rounded-xl bg-mustard/10 p-6 text-center">
            <p className="text-4xl font-black text-ink">4.3</p>
            <p className="mt-2 text-sm text-foreground/70">Stars, and rising</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="space-y-4 mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-terracotta">§ 04 — The Craft</p>
          <h3 className="text-4xl font-black text-ink">Three things we refuse to compromise on.</h3>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="grid gap-8 sm:grid-cols-3 mb-12">
          <div className="rounded-xl border border-terracotta/20 bg-terracotta/5 p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-terracotta/20">
              <span className="text-xl font-black text-terracotta">01</span>
            </div>
            <h4 className="mb-3 text-lg font-bold text-ink">Genuine Quality</h4>
            <p className="text-sm leading-relaxed text-foreground/70">
              Sourced, conditioned and stitched to last more than a season. We'd rather sell less than sell rubbish.
            </p>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <span className="text-xl font-black text-primary">02</span>
            </div>
            <h4 className="mb-3 text-lg font-bold text-ink">Honest Fit</h4>
            <p className="text-sm leading-relaxed text-foreground/70">
              We measure both feet. We'll tell you when a shoe doesn't suit you — even the ones we love.
            </p>
          </div>

          <div className="rounded-xl border border-mustard/20 bg-mustard/5 p-8">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-mustard/20">
              <span className="text-xl font-black text-mustard">03</span>
            </div>
            <h4 className="mb-3 text-lg font-bold text-ink">Open Door</h4>
            <p className="text-sm leading-relaxed text-foreground/70">
              Browse for an hour, sit with a cup of tea, bring the whole family. The shop belongs to the street.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default StorySection;
