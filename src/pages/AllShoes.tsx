import React, { useEffect, useState } from 'react';
import { fetchShoes } from '../api/shoeApi';
import { Search } from 'lucide-react';
import { handleProductImageError, resolveImageUrl } from '@/lib/image';
import type { Shoe } from '@/types/shoe';

const AllShoes: React.FC = () => {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShoes()
      .then((res) => setShoes((res.data.data || []) as Shoe[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredShoes = shoes.filter(shoe =>
    shoe.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shoe.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main id="main-content" className="bg-background">
      {/* Hero */}
      <section className="px-6 sm:px-10 py-10 md:py-14 bg-gradient-to-b from-cream/30 to-background border-b border-border">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-2">Collection</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-3">
            All Shoes
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Browse our complete collection of premium footwear
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border px-6 sm:px-10 py-3">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 sm:px-10 py-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-border bg-card">
                  <div className="w-full h-40 bg-muted animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-muted rounded animate-pulse" />
                    <div className="h-2 bg-muted rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredShoes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredShoes.map((shoe) => (
                <div key={shoe._id} className="group rounded-lg overflow-hidden border border-border bg-card shadow-card hover:shadow-lg hover:border-primary transition-all duration-200 hover:-translate-y-0.5">
                  {/* Image Container */}
                  <div className="relative h-40 bg-muted overflow-hidden">
                    {shoe.images?.[0]?.url ? (
                      <img
                        src={resolveImageUrl(shoe.images[0].url)}
                        alt={shoe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={handleProductImageError}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors text-sm">
                      {shoe.name}
                    </h3>

                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="capitalize text-muted-foreground">
                        {shoe.subcategory || 'Shoe'}
                      </span>
                      {shoe.gender && (
                        <span className="capitalize px-1.5 py-0.5 bg-muted text-muted-foreground rounded font-medium">
                          {shoe.gender}
                        </span>
                      )}
                    </div>

                    {shoe.price && typeof shoe.price === 'number' && (
                      <div className="mt-2 text-sm font-bold text-primary">
                        रु {shoe.price.toLocaleString()}
                      </div>
                    )}

                    <button className="w-full mt-2 py-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-md font-semibold transition-colors duration-200 text-xs">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-base text-muted-foreground mb-3">
                No shoes found matching "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AllShoes;
