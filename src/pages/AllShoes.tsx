import React, { useEffect, useState } from 'react';
import { fetchShoes } from '../api/shoeApi';
import { Search } from 'lucide-react';

const AllShoes: React.FC = () => {
  const [shoes, setShoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchShoes()
      .then((res) => setShoes(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredShoes = shoes.filter(shoe =>
    shoe.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shoe.subcategory?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main id="main-content" className="bg-slate-50">
      {/* Hero */}
      <section className="px-6 sm:px-10 py-10 md:py-14 bg-slate-100 border-b border-slate-200">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500 mb-2">Collection</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
            All Shoes
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl">
            Browse our complete collection of premium footwear in a calm, neat presentation.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 sm:px-10 py-3">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-full border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 transition-all text-sm"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredShoes.map((shoe) => (
                <div key={shoe._id} className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300">
                  {/* Image Container */}
                  <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    {shoe.images?.[0]?.url ? (
                      <img
                        src={shoe.images[0].url}
                        alt={shoe.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-400 text-sm font-medium">No image</span>
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {shoe.trending && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-sm">
                          🔥 Trending
                        </span>
                      )}
                      {shoe.branded && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white shadow-sm">
                          ⭐ Branded
                        </span>
                      )}
                    </div>

                    {/* Price badge */}
                    {shoe.price && (
                      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold bg-white/90 backdrop-blur-sm text-slate-900 shadow-sm">
                        रु {shoe.price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-slate-900 line-clamp-2 text-sm leading-tight group-hover:text-slate-700 transition-colors">
                        {shoe.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 capitalize">
                        {shoe.subcategory || 'Shoe'} • {shoe.gender || 'Unisex'}
                      </p>
                    </div>

                    {/* Brand */}
                    {shoe.brand && shoe.branded && (
                      <p className="text-xs font-medium text-slate-600">
                        {shoe.brand}
                      </p>
                    )}

                    {/* Sizes */}
                    {shoe.sizes?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-slate-500">Sizes:</span>
                        {shoe.sizes.slice(0, 4).map((size) => (
                          <span key={size} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                            {size}
                          </span>
                        ))}
                        {shoe.sizes.length > 4 && (
                          <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded">
                            +{shoe.sizes.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    <button className="w-full mt-4 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-95">
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
