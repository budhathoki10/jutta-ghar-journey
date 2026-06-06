import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";
import floorOne from "@/assets/one.png";
import floorTwo from "@/assets/two.png";
import floorThree from "@/assets/three.png";
import floorFour from "@/assets/four.png";
import floorFive from "@/assets/five.png";
import floorSix from "@/assets/six.png";
import floorSeven from "@/assets/seven.png";
import floorEight from "@/assets/Eight.png";
import floorNine from "@/assets/nine.png";

const floors = [
  {
    id: "first-floor",
    title: "1st Floor",
    shortTitle: "First",
    number: "01",
    eyebrow: "Comfort and daily wear",
    label: "Ladies sports shoes and doctor chappal",
    description:
      "Start here for pairs that are easy to compare, easy to try, and comfortable for daily Kathmandu walking.",
    highlights: ["Doctor chappal", "Ladies sports", "Everyday comfort"],
    images: [
      { src: floorOne, title: "Comfort wall", note: "Daily fits", alt: "First floor comfort shoe display" },
      { src: floorTwo, title: "Doctor chappal", note: "Soft support", alt: "Doctor chappal section on the first floor" },
      { src: floorThree, title: "Daily picks", note: "Ready to try", alt: "Everyday ladies shoe collection" },
    ],
  },
  {
    id: "second-floor",
    title: "2nd Floor",
    shortTitle: "Second",
    number: "02",
    eyebrow: "Occasion and style",
    label: "Sandals, heels and boots",
    description:
      "A calmer floor for dressier choices, with styles grouped so shape, height, and finish are easier to compare.",
    highlights: ["Sandals", "Heels", "Boots"],
    images: [
      { src: floorFour, title: "Sandal display", note: "Open styles", alt: "Second floor sandal display" },
      { src: floorFive, title: "Heels section", note: "Occasion pairs", alt: "Heels arranged on the second floor" },
      { src: floorSix, title: "Boot wall", note: "Structured fits", alt: "Boot collection display" },
    ],
  },
  {
    id: "top-floor",
    title: "Top Floor",
    shortTitle: "Top",
    number: "03",
    eyebrow: "Premium and branded",
    label: "Branded collections",
    description:
      "Head upstairs for branded pairs and premium picks, grouped for focused browsing when you already know the look.",
    highlights: ["Nike", "Adidas", "Premium picks"],
    images: [
      { src: floorSeven, title: "Brand shelves", note: "Popular labels", alt: "Top floor branded shoe shelves" },
      { src: floorEight, title: "Premium wall", note: "Selected pairs", alt: "Premium branded shoe wall" },
      { src: floorNine, title: "New arrivals", note: "Fresh display", alt: "New branded arrivals display" },
    ],
  },
];

const heroPreviewImages = [
  { src: floorOne, label: "1st Floor", alt: "First floor preview" },
  { src: floorFive, label: "2nd Floor", alt: "Second floor preview" },
  { src: floorSeven, label: "Top Floor", alt: "Top floor preview" },
];

const ShopFloors = () => {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative border-b border-border/70">
        <div className="floor-hero-motion absolute inset-0 pointer-events-none" aria-hidden="true" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.72fr)] lg:items-center lg:py-20">
          <ScrollReveal delay={100}>
            <div>
              <p className="inline-flex rounded-full border border-border bg-card/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary shadow-sm sm:text-xs">
                Shop floors
              </p>
              <h1 className="mt-5 max-w-3xl text-3xl font-black leading-[1.04] tracking-tight text-ink xs:text-4xl sm:text-5xl lg:text-6xl">
                Every floor has a clear purpose.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-foreground/75 sm:text-base sm:leading-7">
                A simple guide to where each collection lives inside GoGo Jutta Ghar, so customers can move through the shop with confidence.
              </p>

              <div className="mt-7 flex flex-col gap-3 xs:flex-row xs:flex-wrap">
                <Button asChild className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-terracotta-deep">
                  <a href="#first-floor">
                    Start the tour
                    <ArrowDown className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3">
                {floors.map((floor) => (
                  <a
                    key={floor.id}
                    href={`#${floor.id}`}
                    className="rounded-2xl border border-border bg-card/80 px-3 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary sm:px-4"
                  >
                    <span className="block font-serif text-2xl font-black leading-none text-mustard sm:text-3xl">{floor.number}</span>
                    <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">{floor.shortTitle}</span>
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="floor-path-card relative">
              <div className="grid grid-cols-[1fr_0.72fr] gap-3 rounded-[1.75rem] border border-border bg-card/90 p-3 shadow-soft backdrop-blur sm:gap-4 sm:p-4">
                <article className="group relative overflow-hidden rounded-[1.25rem] bg-muted sm:rounded-[1.5rem]">
                  <img src={heroPreviewImages[0].src} alt={heroPreviewImages[0].alt} className="h-full min-h-[20rem] w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold text-ink backdrop-blur">
                    {heroPreviewImages[0].label}
                  </p>
                </article>
                <div className="grid gap-3 sm:gap-4">
                  {heroPreviewImages.slice(1).map((image) => (
                    <article key={image.label} className="group relative overflow-hidden rounded-[1.25rem] bg-muted sm:rounded-[1.5rem]">
                      <img src={image.src} alt={image.alt} className="h-full min-h-[9.35rem] w-full object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
                      <p className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1.5 text-[11px] font-semibold text-ink backdrop-blur">
                        {image.label}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 left-5 right-5 hidden rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-card backdrop-blur sm:flex sm:items-center sm:justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">3 floors</span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">9 image views</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <nav className="sticky top-[4.25rem] z-30 border-b border-border bg-background/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:justify-center sm:px-6">
          {floors.map((floor) => (
            <a
              key={floor.id}
              href={`#${floor.id}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground/80 shadow-sm transition hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              <span className="font-serif text-base font-black text-mustard">{floor.number}</span>
              <span>{floor.title}</span>
            </a>
          ))}
        </div>
      </nav>

      <div id="floor-guide">
        {floors.map((floor, floorIndex) => (
          <section
            key={floor.id}
            id={floor.id}
            className={cn(
              "relative scroll-mt-32 overflow-hidden border-b border-border/70 py-12 sm:py-16 lg:py-20",
              floorIndex % 2 === 0 ? "bg-background" : "bg-secondary/30",
            )}
          >
            <div className="floor-section-motion absolute inset-0 pointer-events-none" aria-hidden="true" />

            <ScrollReveal delay={100}>
              <div className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(260px,0.58fr)_minmax(0,1.42fr)] lg:gap-12">
                <div className="lg:sticky lg:top-36 lg:self-start">
                  <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
                    {floor.eyebrow}
                  </p>
                  <div className="mt-5 flex items-end gap-4">
                    <span className="font-serif text-6xl font-black leading-none text-mustard sm:text-7xl">{floor.number}</span>
                    <h2 className="pb-1 text-3xl font-black tracking-tight text-ink sm:text-4xl">{floor.title}</h2>
                  </div>
                  <p className="mt-3 text-lg font-semibold leading-7 text-foreground sm:text-xl">{floor.label}</p>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">{floor.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {floor.highlights.map((item) => (
                      <div key={item} className="rounded-full border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground shadow-sm sm:text-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid auto-rows-[minmax(8.5rem,1fr)] grid-cols-2 gap-2 sm:auto-rows-[minmax(11rem,1fr)] sm:grid-cols-3 sm:gap-4 lg:gap-5">
                  {floor.images.map((image, imageIndex) => (
                    <article
                      key={image.title}
                      className={cn(
                        "floor-photo-card group flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-500 hover:-translate-y-1 hover:border-primary/25 hover:shadow-soft sm:rounded-[1.5rem]",
                        imageIndex === 0 ? "row-span-2 sm:col-span-2 sm:row-span-2" : "",
                      )}
                      style={{ animationDelay: `${imageIndex * 120}ms` }}
                    >
                      <div className={cn("relative overflow-hidden bg-muted", imageIndex === 0 ? "min-h-0 flex-1" : "aspect-[4/3]")}>
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading={floorIndex === 0 && imageIndex === 0 ? "eager" : "lazy"}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <span className="absolute right-2 top-2 rounded-full border border-border bg-background/95 px-2.5 py-1 text-[10px] font-black text-primary shadow-sm backdrop-blur sm:right-3 sm:top-3 sm:text-xs">
                          {floor.number}.{imageIndex + 1}
                        </span>
                      </div>
                      <div className="px-2.5 py-2 sm:px-4 sm:py-3.5">
                        <p className="line-clamp-1 text-[11px] font-semibold text-ink sm:text-sm">{image.title}</p>
                        <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">{image.note}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </section>
        ))}
      </div>
    </main>
  );
};

export default ShopFloors;
