import { useEffect, useState } from "react";
import { ArrowDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollReveal } from "@/components/ScrollReveal";
import { cn } from "@/lib/utils";
import floorTwoNav from "@/assets/Floor2Imag.png";
import floorThreeNav from "@/assets/Floor3Image.png";
import heroShoes from "@/assets/hero-shoes.jpg";
import floor2Hills from "@/assets/floor2Hills.png";
import floor2HillsAlt from "@/assets/Floor2hillss.png";
import floor2Boots from "@/assets/floor2bootss.png";
import floor2BootsAlt from "@/assets/floor2boots.png";
import floor2Shoes from "@/assets/Floor2CloseShoes.png";
import floor2ShoesClose from "@/assets/floor2closeee.png";
import floor3Branded from "@/assets/floor3branded.png";
import floor3Tables from "@/assets/floor3tbls.png";
import floor3Boots from "@/assets/florr3boots.png";
import floor3Branded2 from "@/assets/flor3brandedd.png";
import floor3BrandedAlt from "@/assets/florr3brandedd.png";

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
    navImage: null,
    images: [
      { src: heroShoes, title: "Comfort wall", note: "Daily fits", alt: "First floor comfort shoe display" },
      { src: heroShoes, title: "Doctor chappal", note: "Soft support", alt: "Doctor chappal section on the first floor" },
      { src: heroShoes, title: "Daily picks", note: "Ready to try", alt: "Everyday ladies shoe collection" },
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
    navImage: floorTwoNav,
    images: [
      { src: floorTwoNav, title: "Floor overview", note: "Complete view", alt: "Second floor overview" },
      { src: floor2Hills, title: "Heels section", note: "Occasion pairs", alt: "Second floor heels display" },
      { src: floor2HillsAlt, title: "Heels wall", note: "Premium selection", alt: "Heels collection on second floor" },
      { src: floor2Boots, title: "Boot wall", note: "Structured fits", alt: "Boots arranged on the second floor" },
      { src: floor2BootsAlt, title: "Boot collection", note: "Various styles", alt: "Different boot styles on display" },
      { src: floor2Shoes, title: "Close shoes", note: "Detailed view", alt: "Close-up shoe display on second floor" },
      { src: floor2ShoesClose, title: "Shoe details", note: "Premium finishes", alt: "Detailed shoe collection on second floor" },
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
    navImage: floorThreeNav,
    images: [
      { src: floorThreeNav, title: "Floor overview", note: "Complete view", alt: "Top floor overview" },
      { src: floor3Branded, title: "Premium brands", note: "Popular labels", alt: "Top floor premium branded shoes" },
      { src: floor3Tables, title: "Display tables", note: "Organized collection", alt: "Brand shoes on display tables" },
      { src: floor3Boots, title: "Boots display", note: "Selected styles", alt: "Boot collection on top floor" },
      { src: floor3Branded2, title: "Brand collection", note: "Fresh arrivals", alt: "Brand collection display on top floor" },
      { src: floor3BrandedAlt, title: "Branded wall", note: "Premium picks", alt: "Premium branded shoe wall" },
    ],
  },
];

type Floor = (typeof floors)[number];

const FloorImageSlider = ({ floor, floorIndex }: { floor: Floor; floorIndex: number }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideCount, setSlideCount] = useState(floor.images.length);

  useEffect(() => {
    if (!api) {
      return;
    }

    const syncSelectedSlide = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setSlideCount(api.scrollSnapList().length);
    };

    syncSelectedSlide();
    api.on("select", syncSelectedSlide);
    api.on("reInit", syncSelectedSlide);

    return () => {
      api.off("select", syncSelectedSlide);
      api.off("reInit", syncSelectedSlide);
    };
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const autoplay = window.setInterval(() => {
      api.scrollNext();
    }, 2000);

    return () => {
      window.clearInterval(autoplay);
    };
  }, [api]);

  const activeImage = floor.images[selectedIndex] ?? floor.images[0];

  return (
    <div className="min-w-0">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="floor-photo-card overflow-hidden rounded-lg border border-border bg-card shadow-soft"
        aria-label={`${floor.title} image slider`}
      >
        <CarouselContent className="ml-0">
          {floor.images.map((image, imageIndex) => (
            <CarouselItem key={image.title} className="pl-0">
              <article className="bg-card">
                <div className="relative aspect-[4/3] min-h-[17rem] overflow-hidden bg-muted sm:aspect-[16/10] sm:min-h-[24rem] lg:aspect-[16/9] flex items-center justify-center">
                  {image.src ? (
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading={floorIndex === 0 && imageIndex === 0 ? "eager" : "lazy"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <ImageIcon className="h-8 w-8" />
                      <span className="text-sm font-medium">Image not yet added</span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
                    <span className="inline-flex items-center gap-2 rounded-full border border-background/70 bg-background/92 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-primary shadow-sm backdrop-blur sm:text-xs">
                      <ImageIcon className="h-3.5 w-3.5" />
                      {floor.number}.{imageIndex + 1}
                    </span>
                    <span className="rounded-full border border-background/70 bg-ink/72 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-foreground shadow-sm backdrop-blur sm:text-xs">
                      {floor.shortTitle} floor
                    </span>
                  </div>
                </div>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-3 top-1/2 h-10 w-10 -translate-y-1/2 border-background/80 bg-background/92 text-ink shadow-card hover:bg-background sm:left-4" />
        <CarouselNext className="right-3 top-1/2 h-10 w-10 -translate-y-1/2 border-background/80 bg-background/92 text-ink shadow-card hover:bg-background sm:right-4" />
      </Carousel>

      <div className="mt-3 grid gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:p-4">
        <div className="min-w-0">
          <p className="text-base font-black leading-6 text-ink sm:text-lg">{activeImage.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{activeImage.note}</p>
        </div>
        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="flex gap-1.5" aria-label={`${floor.title} slide position`}>
            {floor.images.map((image, dotIndex) => (
              <button
                key={image.title}
                type="button"
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  dotIndex === selectedIndex ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/45",
                )}
                onClick={() => api?.scrollTo(dotIndex)}
                aria-label={`Show ${image.title}`}
                aria-current={dotIndex === selectedIndex ? "true" : undefined}
              />
            ))}
          </div>
          <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {selectedIndex + 1} / {slideCount}
          </span>
        </div>
      </div>
    </div>
  );
};

const ShopFloors = () => {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative border-b border-border/70 bg-background">
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <ScrollReveal delay={100} className="mx-auto max-w-5xl text-center">
            <p className="inline-flex rounded-full border border-border bg-card/90 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary shadow-sm sm:text-xs">
              Shop floors
            </p>
            <h1 className="mx-auto mt-5 max-w-4xl text-3xl font-black leading-[1.04] tracking-tight text-ink xs:text-4xl sm:text-5xl lg:text-6xl">
              Every floor has a clear purpose.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-foreground/75 sm:text-base sm:leading-7">
              A simple guide to where each collection lives inside GoGo Jutta Ghar, so customers can move through the shop with confidence.
            </p>

            <div className="mt-7 flex justify-center">
              <Button asChild className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-terracotta-deep">
                <a href="#first-floor">
                  Start the tour
                  <ArrowDown className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <nav className="sticky top-[4.25rem] z-30 bg-background/95 border-b border-border/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 overflow-x-auto text-sm sm:gap-4">
            {floors.map((floor, index) => (
              <div key={floor.id} className="flex items-center gap-3">
                <a
                  href={`#${floor.id}`}
                  className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-4 py-3 text-left transition-colors hover:border-primary hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {floor.navImage ? (
                    <img
                      src={floor.navImage}
                      alt={`${floor.title} preview`}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-black text-foreground">
                      {floor.number}
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Floor {floor.number}</p>
                    <p className="font-semibold text-foreground">{floor.title}</p>
                  </div>
                </a>

                {index < floors.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      <div id="floor-guide">
        {floors.map((floor, floorIndex) => (
          <section
            key={floor.id}
            id={floor.id}
            className={cn(
              "relative scroll-mt-32 overflow-hidden border-b border-border/70 bg-background py-12 sm:py-16 lg:py-20",
            )}
          >
            <div className="floor-section-motion absolute inset-0 pointer-events-none" aria-hidden="true" />

            <ScrollReveal delay={100} className="relative mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(260px,0.58fr)_minmax(0,1.42fr)] lg:gap-12">
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

              <FloorImageSlider floor={floor} floorIndex={floorIndex} />
            </ScrollReveal>
          </section>
        ))}
      </div>
    </main>
  );
};

export default ShopFloors;
