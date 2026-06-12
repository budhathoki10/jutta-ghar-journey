import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { fetchShoes } from '@/api/shoeApi';
import { handleProductImageError, resolveImageUrl } from '@/lib/image';
import type { Shoe } from '@/types/shoe';

export const TrendingShoes: React.FC = () => {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  useEffect(() => {
    fetchShoes()
      .then((res) => {
        const trendingShoes = ((res.data.data || []) as Shoe[]).filter((shoe) => shoe.trending === true);
        setShoes(trendingShoes.slice(0, 8));
      })
      .catch((err) => {
        console.error('Error fetching shoes:', err);
        setShoes([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
        </div>
      </section>
    );
  }

  if (shoes.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 px-6 sm:px-10 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Trending Now
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Shoes Everyone's Looking For
            </h2>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="relative group">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4"
          >
            {shoes.map((shoe, index) => (
              <div
                key={shoe._id}
                className="flex-shrink-0 w-72 group/card animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-xl transition-all duration-300 group-hover/card:border-primary/20 group-hover/card:scale-[1.02]">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {shoe.images?.[0]?.url ? (
                      <img
                        src={resolveImageUrl(shoe.images[0].url)}
                        alt={shoe.name}
                        onError={handleProductImageError}
                        className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                        <span className="text-muted-foreground text-sm font-medium">No image</span>
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-sm">
                        🔥 Trending
                      </span>
                      {shoe.branded && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white shadow-sm">
                          ⭐ Branded
                        </span>
                      )}
                    </div>

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-foreground line-clamp-2 text-sm group-hover/card:text-primary transition-colors">
                      {shoe.name}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize">
                      {shoe.subcategory || 'Shoe'} • {shoe.gender || 'Unisex'}
                    </p>
                    {shoe.brand && shoe.branded && (
                      <p className="text-xs font-medium text-slate-600">{shoe.brand}</p>
                    )}
                    {shoe.sizes?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs text-muted-foreground">Sizes:</span>
                        {shoe.sizes.slice(0, 3).map((size) => (
                          <span key={size} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                            {size}
                          </span>
                        ))}
                        {shoe.sizes.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                            +{shoe.sizes.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          {showLeftScroll && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {showRightScroll && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <a
            href="/shoes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            View All Shoes
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};
