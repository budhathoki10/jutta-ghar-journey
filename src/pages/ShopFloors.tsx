import { useRef } from "react";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const floors = [
  {
    title: "1st Floor",
    label: "Ladies sports shoes & doctor chappal",
    description: "Sports shoes for everyday movement and the most popular doctor chappal styles for women.",
  },
  {
    title: "2nd Floor",
    label: "Sandals, heels and boots",
    description: "Stylish sandals, sturdy boots, and polished heels for dressy days and evening wear.",
  },
  {
    title: "Top Floor",
    label: "Branded collections",
    description: "Nike, Adidas, TBL and other branded collections displayed with premium care.",
  },
];

const ShopFloors = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const delta = direction === "left" ? -360 : 360;
    sliderRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Shop Floors</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-ink sm:text-5xl">Explore each floor of GoGo Jutta Ghar</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-foreground/80">
          A modern showroom experience with purpose-built floors: women's favourites, daily essentials, and branded collections.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-ink">A shop built for discovery.</h2>
          <p className="max-w-xl text-foreground/80">
            Each floor has its own rhythm. The first floor is comfortable and active, the second floor is elegant and sturdy, and the top floor is reserved for popular labels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => handleScroll("left")} variant="outline" className="rounded-full px-4 py-3">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button onClick={() => handleScroll("right")} variant="outline" className="rounded-full px-4 py-3">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={sliderRef} className="mt-10 flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
        {floors.map((floor) => (
          <article key={floor.title} className="min-w-[320px] snap-start rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-primary">
              <Layers className="h-4 w-4" />
              <span>{floor.title}</span>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-amber-100 p-6 text-foreground shadow-inner">
              <div className="flex h-full flex-col items-start justify-end gap-3">
                <div className="rounded-3xl border border-primary/20 bg-white/80 p-4 shadow-sm">
                  <p className="text-lg font-semibold text-ink">{floor.label}</p>
                </div>
                <p className="max-w-xs text-sm leading-6 text-foreground/80">Placeholder image area. Add 3–4 floor photos here later to show your shop layout.</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <p className="text-sm text-muted-foreground">{floor.description}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="rounded-2xl border border-border bg-background p-3 text-xs text-muted-foreground">
                    Floor image {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ShopFloors;
