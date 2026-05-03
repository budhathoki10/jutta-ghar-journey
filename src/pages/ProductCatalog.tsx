import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Sparkles, ChevronLeft, ChevronRight, Phone, SlidersHorizontal, X } from "lucide-react";
import { fetchShoes } from "@/api/shoeApi";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;

const ProductCatalog = () => {
  const [shoes, setShoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [category, setCategory] = useState("all");
  const [branded, setBranded] = useState("all");
  const [brand, setBrand] = useState("all");
  const [size, setSize] = useState("all");
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false); // ← NEW

  useEffect(() => {
    fetchShoes()
      .then((res) => setShoes(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(shoes.map((shoe) => shoe.subcategory?.toString() || "Other"))).sort()],
    [shoes],
  );

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
      if (category !== "all" && shoe.subcategory !== category) return false;
      if (branded !== "all") {
        const isBranded = Boolean(shoe.branded);
        if (branded === "branded" && !isBranded) return false;
        if (branded === "non-branded" && isBranded) return false;
      }
      if (brand !== "all") {
        const normalizedBrand = shoe.brand?.toString() || "Non-branded";
        if (normalizedBrand !== brand) return false;
      }
      if (size !== "all" && !(shoe.sizes || []).includes(Number(size))) return false;
      if (trendingOnly && !shoe.trending) return false;
      return true;
    });
  }, [shoes, search, gender, category, branded, brand, size, trendingOnly]);

  const pageCount = Math.max(1, Math.ceil(filteredShoes.length / ITEMS_PER_PAGE));
  const paginated = filteredShoes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, gender, category, branded, brand, size, trendingOnly]);

  // Count active filters for badge
  const activeFilterCount = [
    gender !== "all",
    category !== "all",
    branded !== "all",
    brand !== "all",
    size !== "all",
    trendingOnly,
    search.trim() !== "",
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch("");
    setGender("all");
    setCategory("all");
    setBranded("all");
    setBrand("all");
    setSize("all");
    setTrendingOnly(false);
  };

  // Shared filter panel content
  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" /> Filters
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Reset all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-[0.25em] text-muted-foreground">Search</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, brand, type, gender…"
            className="w-full rounded-full border border-border py-3 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
          <option value="all">All</option>
          <option value="male">Men</option>
          <option value="female">Women</option>
        </select>
      </div>

      {/* Shoe type */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">Shoe type</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
          {categories.map((item) => (
            <option key={item} value={item}>{item === "all" ? "All" : item}</option>
          ))}
        </select>
      </div>

      {/* Brand toggle */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">Brand</label>
        <select value={branded} onChange={(e) => setBranded(e.target.value)} className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
          <option value="all">All</option>
          <option value="branded">Branded</option>
          <option value="non-branded">Non-branded</option>
        </select>
      </div>

      {/* Brand name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">Brand name</label>
        <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
          {brands.map((item) => (
            <option key={item} value={item}>{item === "all" ? "All" : item}</option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">Available size</label>
        <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
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
    <div className="mx-auto max-w-7xl px-6 py-16">

      {/* Page header */}
      <div className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Product Catalog</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-ink sm:text-5xl">Browse our catalog of shoes</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-foreground/80">
          Discover doctor chappal, sports shoes, sandals, heels, boots and top branded collections
          with live search and filters designed for easy browsing.
        </p>
      </div>

      {/* Mobile filter toggle button */}
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-sm text-muted-foreground">{filteredShoes.length} items found</p>
        <button
          onClick={() => setFiltersOpen(true)}
          className="relative inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:border-primary hover:text-primary"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
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
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-background p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-ink">Filter Shoes</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterPanel />
            <Button
              className="mt-6 w-full rounded-full"
              onClick={() => setFiltersOpen(false)}
            >
              Show {filteredShoes.length} results
            </Button>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

        {/* Desktop sidebar — always visible on lg+ */}
        <aside className="hidden lg:block space-y-6 self-start rounded-3xl border border-border bg-card p-6 shadow-sm sticky top-24">
          <FilterPanel />
        </aside>

        {/* Results */}
        <section className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">{filteredShoes.length} items</p>
              <h2 className="text-2xl font-bold text-ink">Modern catalogue for every shoe shopper.</h2>
            </div>
            <Button asChild variant="outline" className="rounded-full px-5 py-3 text-sm">
              <Link to="/contact"><Phone className="mr-2 h-4 w-4" />Contact to Order</Link>
            </Button>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
              Loading shoes…
            </div>
          ) : paginated.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-10 text-center">
              <p className="text-lg font-semibold text-ink">No shoes found</p>
              <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
              <button onClick={resetFilters} className="mt-4 text-sm font-semibold text-primary hover:underline">
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {paginated.map((shoe) => (
                <article key={shoe._id} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                      src={shoe.images?.[0]?.url || "https://via.placeholder.com/600x750?text=No+image"}
                      alt={shoe.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {shoe.trending && (
                      <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-primary-foreground">
                        Trending
                      </span>
                    )}
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-ink">{shoe.name}</h3>
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                        {shoe.subcategory} · {shoe.gender}
                      </p>
                    </div>
                    <div className="grid gap-2 text-sm text-foreground/80">
                      <p><span className="font-semibold text-foreground">Brand:</span> {shoe.branded ? shoe.brand || "Branded" : "Non-branded"}</p>
                      <p><span className="font-semibold text-foreground">Sizes:</span> {shoe.sizes?.length ? `${Math.min(...shoe.sizes)}–${Math.max(...shoe.sizes)}` : "Not set"}</p>
                    </div>
                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button asChild variant="secondary" className="rounded-full px-4 py-2 text-sm">
                        <Link to={`/shoes/${shoe._id}`}>View Details</Link>
                      </Button>
                      <Button asChild className="rounded-full px-4 py-2 text-sm">
                        <a href="tel:+9779800000000">Contact to Order</a>
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between gap-3 rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <span>
              {filteredShoes.length === 0 ? "0" : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(filteredShoes.length, page * ITEMS_PER_PAGE)} of {filteredShoes.length} shoes
            </span>
            <div className="flex items-center gap-2">
              <Button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-foreground">Page {page} of {pageCount}</span>
              <Button disabled={page >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))} variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductCatalog;