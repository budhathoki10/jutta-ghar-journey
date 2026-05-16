import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, SlidersHorizontal, X, LayoutGrid, LayoutList } from "lucide-react";
import { fetchShoes } from "@/api/shoeApi";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ScrollReveal";

const ITEMS_PER_PAGE = 12;

const GENDER_CATEGORIES: Record<string, string[]> = {
  male: ['Slippers', 'Boots', 'Shoes', 'Branded'],
  female: ['Doctor Chappal', 'Slippers', 'Sport Shoes', 'Branded', 'Boots', 'Hills', 'Close Shoes'],
  unisex: ['Branded Shoes'],
};

const ProductCatalog = () => {
  const [shoes, setShoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [size, setSize] = useState("all");
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [sort, setSort] = useState("best-match");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchShoes()
      .then((res) => setShoes(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    if (gender === 'male') return ['all', ...GENDER_CATEGORIES.male];
    if (gender === 'female') return ['all', ...GENDER_CATEGORIES.female];
    if (gender === 'unisex') return ['all', ...GENDER_CATEGORIES.unisex];
    return [
      'all',
      ...new Set(
        shoes
          .map((shoe) => shoe.subcategory?.toString() || '')
          .filter(Boolean)
          .map((item) => item.trim())
      ),
    ];
  }, [gender, shoes]);

  const brands = useMemo(
    () => ["all", ...Array.from(new Set(shoes.map((shoe) => shoe.brand?.trim() || "Non-branded").filter(Boolean))).sort()],
    [shoes],
  );

  const sizes = useMemo(
    () => [
      "all",
      ...Array.from(new Set(shoes.flatMap((shoe) => shoe.sizes || []))).sort((a, b) => a - b).map(String),
    ],
    [shoes],
  );

  const filteredShoes = useMemo(() => {
    return shoes.filter((shoe) => {
      const name = shoe.name?.toString().toLowerCase() || "";
      const searchTerm = search.trim().toLowerCase();
      const matchesSearch =
        !searchTerm ||
        name.includes(searchTerm) ||
        shoe.subcategory?.toString().toLowerCase().includes(searchTerm) ||
        shoe.brand?.toString().toLowerCase().includes(searchTerm) ||
        shoe.gender?.toString().toLowerCase().includes(searchTerm);

      if (!matchesSearch) return false;
      if (gender !== "all" && shoe.gender !== gender) return false;
      if (category !== "all") {
        const selectedCategory = category.toString().toLowerCase();
        const shoeCategory = shoe.subcategory?.toString().toLowerCase() || '';
        if (shoeCategory !== selectedCategory) return false;
      }
      if (brand !== "all") {
        const normalizedBrand = shoe.brand?.toString() || "Non-branded";
        if (normalizedBrand !== brand) return false;
      }
      if (size !== "all" && !(shoe.sizes || []).includes(Number(size))) return false;
      if (trendingOnly && !shoe.trending) return false;
      return true;
    });
  }, [shoes, search, gender, category, brand, size, trendingOnly]);

  const sortedShoes = useMemo(() => {
    const sorted = [...filteredShoes];
    switch (sort) {
      case 'newest':
        return sorted.sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0));
      case 'popular':
        return sorted.sort((a, b) => (b.sold || 0) - (a.sold || 0));
      case 'name-asc':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name-desc':
        return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      default:
        return sorted;
    }
  }, [filteredShoes, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedShoes.length / ITEMS_PER_PAGE));
  const paginated = sortedShoes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const paginationRange = useMemo(() => {
    const range: Array<number | string> = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(pageCount, page + 1);

    if (start > 1) range.push(1);
    if (start > 2) range.push("start-ellipsis");
    for (let i = start; i <= end; i += 1) range.push(i);
    if (end < pageCount - 1) range.push("end-ellipsis");
    if (end < pageCount) range.push(pageCount);

    return range;
  }, [page, pageCount]);

  useEffect(() => {
    setPage(1);
  }, [search, gender, category, brand, size, trendingOnly, sort]);

  // Count active filters for badge
  const activeFilterCount = [
    gender !== "all",
    category !== "all",
    brand !== "all",
    size !== "all",
    trendingOnly,
    search.trim() !== "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch("");
    setGender("all");
    setCategory("all");
    setBrand("all");
    setSize("all");
    setTrendingOnly(false);
  };

  // Shared filter panel content
  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Filters
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-[10px] font-semibold text-primary hover:underline"
          >
            Reset all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="block text-[10px] uppercase tracking-[0.32em] text-slate-500">Search</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, brand, type, gender…"
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-xs text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground">Gender</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'All', value: 'all' },
            { label: 'Men', value: 'male' },
            { label: 'Women', value: 'female' },
            { label: 'Unisex', value: 'unisex' },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setGender(option.value)}
              className={cn(
                'rounded-2xl border px-3 py-2 text-sm font-medium transition',
                gender === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shoe type */}
      <div className="space-y-2">
        <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground">Shoe type</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-border px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
          {categories.map((item) => (
            <option key={item} value={item}>{item === "all" ? "All categories" : item}</option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground">Brand</label>
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-xl border border-border px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
          {brands.map((item) => (
            <option key={item} value={item}>{item === "all" ? "All brands" : item}</option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div className="space-y-2">
        <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground">Available size</label>
        <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full rounded-xl border border-border px-3 py-2 text-xs outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
          {sizes.map((item) => (
            <option key={item} value={item}>{item === "all" ? "All sizes" : item}</option>
          ))}
        </select>
      </div>

      {/* Trending toggle */}
      <div className="flex items-center justify-between gap-3 rounded-3xl border border-border bg-background p-4">
        <div>
          <p className="text-sm font-semibold">Trending</p>
          <p className="text-xs text-muted-foreground">Show only trending shoes</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={trendingOnly}
            onChange={(e) => setTrendingOnly(e.target.checked)}
            className="h-4 w-4 rounded border border-border text-primary accent-primary"
          />
          <span className="text-sm">Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14 bg-slate-50 text-slate-900">

      {/* Page header */}
      <ScrollReveal delay={100}>
        <div className="mb-8 sm:mb-12 grid gap-5 lg:grid-cols-[1.6fr_auto] items-start">
          <div className="text-center lg:text-left">
            <p className="text-[11px] uppercase tracking-[0.35em] text-slate-500">Product Catalog</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">Browse our catalog of shoes</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 lg:max-w-none">
              Discover doctor chappal, sports shoes, sandals, heels, boots and top branded collections with a clean and compact browsing experience.
            </p>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <Button asChild variant="outline" className="rounded-full px-4 py-2 text-xs sm:text-sm font-semibold">
              <Link to="/admin/login">Admin Login</Link>
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Mobile filter toggle button */}
      <div className="mb-3 sm:mb-4 flex items-center justify-between lg:hidden">
        <p className="text-xs sm:text-sm text-muted-foreground">{filteredShoes.length} items found</p>
        <button
          onClick={() => setFiltersOpen(true)}
          className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition hover:border-primary hover:text-primary"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile filter drawer overlay */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-background p-4 sm:p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-ink">Filter Shoes</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterPanel />
            <Button
              className="mt-4 sm:mt-6 w-full rounded-full text-xs sm:text-sm"
              onClick={() => setFiltersOpen(false)}
            >
              Show {filteredShoes.length} results
            </Button>
          </div>
        </div>
      )}

      {/* Main grid */}
      <ScrollReveal delay={200}>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[280px_1fr]">


        {/* Desktop sidebar — always visible on lg+ */}
        <aside className="hidden lg:block space-y-4 sm:space-y-6 self-start rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm sticky top-24">
          <FilterPanel />
        </aside>

        {/* Results */}
        <section className="space-y-4 sm:space-y-8">
          <div className="rounded-[2rem] border border-border bg-card p-3 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  {search.trim()
                    ? `Showing results for "${search.trim()}"`
                    : category !== 'all'
                    ? `Showing results for ${category}`
                    : 'Showing all products'}
                </p>
                <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-black tracking-tight text-ink">
                  Curated shoe collections for every step.
                </h2>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-foreground/75">
                  Compact browsing cards, live filters, and effortless product discovery in a clean storefront layout.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] text-foreground">
                  <span className="font-semibold">{filteredShoes.length}</span>
                  <span className="text-muted-foreground hidden xs:inline">items</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] text-foreground">
                  <span>Sort:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-full border border-border bg-white py-1 px-2 text-[11px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="best-match">Best Match</option>
                    <option value="newest">Newest</option>
                    <option value="popular">Popular</option>
                    <option value="name-asc">Name A–Z</option>
                    <option value="name-desc">Name Z–A</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'inline-flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-full border transition',
                    viewMode === 'grid'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary hover:text-primary',
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'inline-flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-full border transition',
                    viewMode === 'list'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary hover:text-primary',
                  )}
                >
                  <LayoutList className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 text-center text-xs sm:text-sm text-muted-foreground">
              Loading shoes…
            </div>
          ) : paginated.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 text-center">
              <p className="text-base sm:text-lg font-semibold text-ink">No shoes found</p>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
              <button onClick={resetFilters} className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold text-primary hover:underline">
                Reset all filters
              </button>
            </div>
          ) : (
            <div className={cn(
              'grid gap-3 sm:gap-5',
              viewMode === 'grid'
                ? 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1',
            )}>
              {paginated.map((shoe, index) => (
                <ScrollReveal key={shoe._id} delay={index * 100}>
                  {viewMode === 'grid' ? (
                    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20">
                      <div className="relative overflow-hidden rounded-t-2xl bg-slate-50">
                        <div className="aspect-square bg-[#f5f5f5]">
                          <img
                            src={shoe.images?.[0]?.url || "https://via.placeholder.com/600x600?text=No+image"}
                            alt={shoe.name}
                            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute left-3 top-3 flex flex-col gap-2">
                          {shoe.trending && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-sm">
                              🔥 Trending
                            </span>
                          )}
                          {shoe.branded && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white shadow-sm">
                              ⭐ Branded
                            </span>
                          )}
                        </div>
                        {shoe.price && (
                          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm font-bold bg-white/95 backdrop-blur-sm text-slate-900 shadow-sm">
                            रु {shoe.price.toLocaleString()}
                          </div>
                        )}
                      </div>
                      <div className="space-y-3 p-4">
                        <div>
                          <h3 className="text-sm font-semibold text-ink capitalize line-clamp-2 group-hover:text-primary transition-colors">{shoe.name}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{shoe.subcategory || 'Other'} · {shoe.gender || 'Unisex'}</p>
                        </div>
                        {shoe.brand && shoe.branded && (
                          <p className="text-xs font-medium text-slate-600">{shoe.brand}</p>
                        )}
                        <div className="grid gap-2 text-xs text-muted-foreground">
                          {shoe.sizes?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span>Sizes:</span>
                              {shoe.sizes.slice(0, 3).map((size) => (
                                <span key={size} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                  {size}
                                </span>
                              ))}
                              {shoe.sizes.length > 3 && (
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                                  +{shoe.sizes.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                            {shoe.gender}
                          </span>
                          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                            {shoe.subcategory || 'Collection'}
                          </span>
                        </div>
                        <Link
                          to={`/shoes/${shoe._id}`}
                          className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                        >
                          View details
                        </Link>
                      </div>
                    </article>
                  ) : (
                    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20 sm:flex-row">
                      <div className="relative h-72 overflow-hidden bg-slate-50 sm:h-auto sm:w-64">
                        <img
                          src={shoe.images?.[0]?.url || "https://via.placeholder.com/600x600?text=No+image"}
                          alt={shoe.name}
                          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-base font-semibold text-ink capitalize line-clamp-2 group-hover:text-primary transition-colors">{shoe.name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{shoe.subcategory || 'Other'} · {shoe.gender || 'Unisex'}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {shoe.trending && (
                              <span className="rounded-full bg-orange-500 px-3 py-1 text-[11px] font-semibold text-white">
                                Trending
                              </span>
                            )}
                            {shoe.branded && (
                              <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                                Branded
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-600">{shoe.description?.slice(0, 120) || 'Explore the details, sizes, and colors of this shoe.'}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            {shoe.sizes?.length > 0 && (
                              <span className="rounded-full border border-border bg-background px-3 py-1">Sizes {Math.min(...shoe.sizes)}–{Math.max(...shoe.sizes)}</span>
                            )}
                            <span className="rounded-full border border-border bg-background px-3 py-1">{shoe.brand || 'Non-branded'}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-lg font-bold text-slate-900">
                            {shoe.price ? `रु ${shoe.price.toLocaleString()}` : 'Price N/A'}
                          </div>
                          <Link
                            to={`/shoes/${shoe._id}`}
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                          >
                            View details
                          </Link>
                        </div>
                      </div>
                    </article>
                  )}
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Pagination */}
          <ScrollReveal delay={300}>
            <Pagination className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              {filteredShoes.length === 0 ? "0" : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(filteredShoes.length, page * ITEMS_PER_PAGE)} of {filteredShoes.length} shoes
            </span>
            <PaginationContent className="justify-center">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={page <= 1}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page <= 1) return;
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>
              {paginationRange.map((item) =>
                typeof item === "number" ? (
                  <PaginationItem key={item}>
                    <PaginationLink
                      href="#"
                      isActive={item === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(item as number);
                      }}
                      size="default"
                    >
                      {item}
                    </PaginationLink>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={page >= pageCount}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page >= pageCount) return;
                    setPage((p) => Math.min(pageCount, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          </ScrollReveal>
        </section>
      </div>
      </ScrollReveal>
    </div>
  );
};

export default ProductCatalog;