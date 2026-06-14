import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, LayoutList } from "lucide-react";
import { fetchShoes } from "@/api/shoeApi";
import { handleProductImageError, resolveOptimizedProductImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ProductFilters } from "@/components/ProductFilters";
import { useReveal } from "@/hooks/use-reveal";
import ShoeModal from "@/components/ShoeModal";
import type { Shoe } from "@/types/shoe";

const ITEMS_PER_PAGE = 12;
const NEW_DAYS = 15;
const NEW_DURATION_MS = NEW_DAYS * 24 * 60 * 60 * 1000;

const normalizeSearchText = (value?: string | number | null) =>
  value
    ?.toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim() || "";

const getSearchVariants = (term: string) => {
  const variants = new Set([term]);

  if (term.endsWith("ies") && term.length > 3) {
    variants.add(`${term.slice(0, -3)}y`);
  }

  if (term.endsWith("es") && term.length > 2) {
    variants.add(term.slice(0, -2));
  }

  if (term.endsWith("s") && term.length > 1) {
    variants.add(term.slice(0, -1));
  } else {
    variants.add(`${term}s`);
  }

  return Array.from(variants).filter(Boolean);
};

const matchesSearchTerm = (haystack: string, term: string) =>
  getSearchVariants(term).some((variant) => haystack.includes(variant));

const getCreatedTime = (shoe: Shoe) => {
  const dateTime = shoe.createdAt ? new Date(shoe.createdAt).getTime() : 0;
  if (Number.isFinite(dateTime) && dateTime > 0) return dateTime;

  const objectIdTime = /^[a-f0-9]{24}$/i.test(shoe._id)
    ? parseInt(shoe._id.slice(0, 8), 16) * 1000
    : 0;

  return Number.isFinite(objectIdTime) ? objectIdTime : 0;
};

const isTrendingShoe = (shoe: Shoe) => {
  return shoe.trending === true;
};

const isNewShoe = (shoe: Shoe) => {
  const createdTime = getCreatedTime(shoe);
  return createdTime > 0 && Date.now() - createdTime <= NEW_DURATION_MS;
};

const getSearchScore = (shoe: Shoe, searchTerm: string) => {
  if (!searchTerm) return 0;

  const name = normalizeSearchText(shoe.name);
  const category = normalizeSearchText(shoe.subcategory);
  const brand = normalizeSearchText(shoe.brand);
  const trending = isTrendingShoe(shoe);
  const isNew = isNewShoe(shoe);

  if (trending && matchesSearchTerm("trending", searchTerm)) return 0;
  if (isNew && matchesSearchTerm("new newest latest fresh arrival", searchTerm)) return 0;
  if (name === searchTerm || category === searchTerm) return 0;
  if (name.startsWith(searchTerm) || category.startsWith(searchTerm)) return 1;
  if (name.includes(searchTerm) || category.includes(searchTerm)) return 2;
  if (brand.includes(searchTerm)) return 3;
  return 4;
};

const ProductCatalog = () => {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [category, setCategory] = useState("all");
  const [trendingOnly, setTrendingOnly] = useState(false);
  const [sort, setSort] = useState("best-match");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
  const isModalOpen = Boolean(selectedShoe);

  const openShoeModal = (shoe: Shoe) => {
    setSelectedShoe(shoe);
  };

  const closeShoeModal = () => {
    setSelectedShoe(null);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    fetchShoes()
      .then((res) => {
        setShoes((res.data.data || []) as Shoe[]);
        setLoadError("");
      })
      .catch((error) => {
        console.error(error);
        setLoadError("We couldn't load the live catalog. Please call or message the shop for current stock.");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const scopedShoes = gender === "all" ? shoes : shoes.filter((shoe) => shoe.gender === gender);
    return [
      "all",
      ...new Set(
        scopedShoes
          .map((shoe) => shoe.subcategory?.toString() || "")
          .filter(Boolean)
          .map((item) => item.trim()),
      ),
    ];
  }, [gender, shoes]);

  useEffect(() => {
    if (category !== "all" && !categories.includes(category)) {
      setCategory("all");
    }
  }, [categories, category]);

  const filteredShoes = useMemo(() => {
    const searchTerm = normalizeSearchText(search);
    const searchTerms = searchTerm.split(" ").filter(Boolean);

    return shoes.filter((shoe) => {
      if (searchTerms.length) {
        const haystack = [
          shoe.name,
          shoe.subcategory,
          shoe.brand,
          shoe.gender,
          shoe.description,
          isTrendingShoe(shoe) ? "trending" : "",
          isNewShoe(shoe) ? "new newest latest fresh arrival" : "",
        ]
          .map(normalizeSearchText)
          .join(" ");

        if (!searchTerms.every((term) => matchesSearchTerm(haystack, term))) {
          return false;
        }
      }

      if (gender !== "all" && shoe.gender !== gender) return false;
      if (category !== "all") {
        const selectedCategory = category.toString().toLowerCase();
        const shoeCategory = shoe.subcategory?.toString().trim().toLowerCase() || "";
        if (shoeCategory !== selectedCategory) return false;
      }
      if (trendingOnly && !isTrendingShoe(shoe)) return false;
      return true;
    });
  }, [shoes, search, gender, category, trendingOnly]);

  const sortedShoes = useMemo(() => {
    const sorted = [...filteredShoes];
    const searchTerm = normalizeSearchText(search);

    switch (sort) {
      case "newest":
        return sorted.sort((a, b) => getCreatedTime(b) - getCreatedTime(a));
      case "popular":
        return sorted.sort((a, b) => (b.sold || 0) - (a.sold || 0));
      case "name-asc":
        return sorted.sort((a, b) => (a.name || "").localeCompare(b.name || "", undefined, { numeric: true, sensitivity: "base" }));
      case "name-desc":
        return sorted.sort((a, b) => (b.name || "").localeCompare(a.name || "", undefined, { numeric: true, sensitivity: "base" }));
      default:
        return sorted.sort((a, b) => {
          const scoreDelta = getSearchScore(a, searchTerm) - getSearchScore(b, searchTerm);
          if (scoreDelta !== 0) return scoreDelta;
          return getCreatedTime(b) - getCreatedTime(a);
        });
    }
  }, [filteredShoes, search, sort]);

  const pageCount = Math.max(1, Math.ceil(sortedShoes.length / ITEMS_PER_PAGE));
  const paginated = sortedShoes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const showPagination = pageCount > 1;

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
  }, [search, gender, category, trendingOnly, sort]);

  useReveal([loading, paginated.length, page, viewMode, selectedShoe]);

  const getGenderLabel = (value: string) => {
    const labels: Record<string, string> = {
      all: "All",
      male: "Men",
      female: "Women",
      unisex: "Unisex",
    };
    return labels[value] || value;
  };

  const activeFilters = [
    search.trim() ? { label: `Search: ${search.trim()}`, clear: () => setSearch("") } : null,
    gender !== "all" ? { label: getGenderLabel(gender), clear: () => setGender("all") } : null,
    category !== "all" ? { label: category, clear: () => setCategory("all") } : null,
    trendingOnly ? { label: "Trending", clear: () => setTrendingOnly(false) } : null,
  ].filter(Boolean) as Array<{ label: string; clear: () => void }>;

  const activeFilterCount = activeFilters.length;

  const resetFilters = () => {
    setSearch("");
    setGender("all");
    setCategory("all");
    setTrendingOnly(false);
  };

  const getImage = (shoe: Shoe) => resolveOptimizedProductImageUrl(shoe.images?.[0]?.url, { width: 640, height: 640 });
  const getPrice = (shoe: Shoe) => {
    const raw = shoe.price;
    const num = typeof raw === "number" ? raw : Number(raw);
    if (!num || Number.isNaN(num)) return "Price N/A";
    return `रु ${num.toLocaleString()}`;
  };
  const getSizeLabel = (shoe: Shoe) => {
    if (!shoe.sizes?.length) return "Ask for size";
    if (shoe.sizes.length === 1) return `Size ${shoe.sizes[0]}`;
    return `Sizes ${Math.min(...shoe.sizes)}-${Math.max(...shoe.sizes)}`;
  };

  const ProductTile = ({ shoe, index }: { shoe: Shoe; index: number }) => (
    <article
      className="shoe-scroll-reveal group flex min-h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md"
    >
      <button
        type="button"
        onClick={() => openShoeModal(shoe)}
        className="block text-left"
        aria-label={`Open ${shoe.name} details`}
      >
        <div className="relative aspect-square overflow-hidden bg-secondary/35">
          <img
            src={getImage(shoe)}
            alt={shoe.name}
            loading={index < 4 ? "eager" : "lazy"}
            decoding="async"
            onError={handleProductImageError}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            {isNewShoe(shoe) && (
              <span className="inline-block rounded bg-red-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-md">
                New
              </span>
            )}
            {isTrendingShoe(shoe) && (
              <span className="inline-block rounded bg-red-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-md">
                Trending
              </span>
            )}
            {shoe.soldOut && (
              <span className="inline-block rounded bg-ink px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-md">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="flex flex-1 flex-col justify-between gap-3 p-3 sm:p-4">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{shoe.subcategory || "Collection"}</p>
          <button
            type="button"
            onClick={() => openShoeModal(shoe)}
            className="mt-2 w-full text-left"
          >
            <h3 className="line-clamp-2 text-sm font-bold leading-5 text-ink transition group-hover:text-primary sm:text-base">
              {shoe.name}
            </h3>
          </button>
          <p className="mt-1 text-xs text-muted-foreground">{getSizeLabel(shoe)}</p>
        </div>

        <button
          type="button"
          onClick={() => openShoeModal(shoe)}
          className="inline-flex items-center justify-center rounded bg-red-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-700 sm:text-sm"
          aria-label={`View ${shoe.name} details`}
        >
          View Details
        </button>
      </div>
    </article>
  );

  const ProductRow = ({ shoe, index }: { shoe: Shoe; index: number }) => (
    <article
      className="shoe-scroll-reveal group grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md sm:grid-cols-[10rem_1fr_auto] sm:items-center"
    >
      <button
        type="button"
        onClick={() => openShoeModal(shoe)}
        className="block overflow-hidden rounded-lg bg-secondary/35 text-left"
        aria-label={`Open ${shoe.name} details`}
      >
        <img 
          src={getImage(shoe)} 
          alt={shoe.name} 
          loading={index < 4 ? "eager" : "lazy"} 
          decoding="async"
          onError={handleProductImageError}
          className="aspect-square h-full w-full object-cover transition duration-300 group-hover:scale-110" 
        />
      </button>
      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{shoe.subcategory || "Collection"}</p>
        <button type="button" onClick={() => openShoeModal(shoe)} className="mt-2 w-full text-left">
          <h3 className="line-clamp-1 text-base font-bold text-ink transition group-hover:text-primary sm:text-lg">{shoe.name}</h3>
        </button>
        <p className="mt-1 text-xs text-muted-foreground">{shoe.brand || "Non-branded"}</p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{getSizeLabel(shoe)}</p>
      </div>
      <button
        type="button"
        onClick={() => openShoeModal(shoe)}
        className="rounded bg-red-600 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-red-700"
      >
        View Details
      </button>
    </article>
  );

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
          <ScrollReveal delay={100}>
            <section className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-primary">Browse Shoes</p>
              <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl md:text-5xl">
                Our Collection
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Discover premium footwear handpicked for quality and style.
              </p>
            </section>
          </ScrollReveal>
        </div>

        {/* New Filter Component */}
        <ProductFilters
          search={search}
          gender={gender}
          category={category}
          trendingOnly={trendingOnly}
          sort={sort}
          viewMode={viewMode}
          categories={categories}
          filtersOpen={filtersOpen}
          activeFilterCount={activeFilterCount}
          onSearchChange={handleSearchChange}
          onGenderChange={(value) => {
            setGender(value);
            setCategory("all");
          }}
          onCategoryChange={setCategory}
          onTrendingChange={setTrendingOnly}
          onSortChange={setSort}
          onViewModeChange={setViewMode}
          onFiltersOpenChange={setFiltersOpen}
          onResetFilters={resetFilters}
        />

        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16">
          <ScrollReveal delay={160}>
            <section className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {search.trim() ? `Showing results for "${search.trim()}"` : "Available shoes"}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <p className="text-sm font-medium text-muted-foreground sm:text-right">{filteredShoes.length} pairs found</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border transition",
                        viewMode === "grid" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
                      )}
                      aria-label="Grid view"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border transition",
                        viewMode === "list" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
                      )}
                      aria-label="List view"
                    >
                      <LayoutList className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                      <div className="aspect-[3/4] animate-pulse bg-muted" />
                      <div className="space-y-2 p-3 sm:p-4">
                        <div className="h-2 w-1/2 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-full animate-pulse rounded bg-muted" />
                        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                        <div className="mt-2 h-8 w-full animate-pulse rounded bg-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : loadError ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                  <p className="text-lg font-black text-ink">Live catalog unavailable</p>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{loadError}</p>
                  <Link to="/contact" className="mt-5 inline-flex rounded bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700">
                    Contact the shop
                  </Link>
                </div>
              ) : paginated.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                  <p className="text-lg font-black text-ink">No shoes found</p>
                  <p className="mt-2 text-sm text-muted-foreground">Try clearing one filter or searching a broader term.</p>
                  <button onClick={resetFilters} className="mt-5 rounded bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700">
                    Reset filters
                  </button>
                </div>
              ) : (
                <div
                  className={cn(
                    viewMode === "grid"
                      ? "grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-4"
                      : "grid gap-3 sm:gap-4",
                  )}
                >
                  {paginated.map((shoe, index) =>
                    viewMode === "grid" ? <ProductTile key={shoe._id} shoe={shoe} index={index} /> : <ProductRow key={shoe._id} shoe={shoe} index={index} />,
                  )}
                </div>
              )}

              {showPagination && (
                <nav className="reveal flex flex-col items-center gap-4 pt-8" aria-label="Shoe pages">
                  {/* Pagination Controls */}
                  <div className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card/70 backdrop-blur-sm p-2 shadow-sm hover:shadow-md transition-shadow">
                    {/* Previous Button */}
                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled={page <= 1}
                      onClick={(event) => {
                        event.preventDefault();
                        if (page <= 1) return;
                        setPage((current) => Math.max(1, current - 1));
                      }}
                      className={cn(
                        "flex h-9 min-w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all",
                        page > 1
                          ? "text-foreground hover:bg-primary/10 hover:text-primary active:scale-95"
                          : "text-muted-foreground/40 cursor-not-allowed"
                      )}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1 px-1">
                      {paginationRange.map((item) =>
                        typeof item === "number" ? (
                          <button
                            key={item}
                            type="button"
                            aria-label={`Page ${item}`}
                            aria-current={item === page ? "page" : undefined}
                            onClick={(event) => {
                              event.preventDefault();
                              setPage(item as number);
                            }}
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all",
                              item === page
                                ? "bg-primary text-primary-foreground shadow-md scale-105"
                                : "text-foreground hover:bg-muted active:scale-95",
                            )}
                          >
                            {item}
                          </button>
                        ) : (
                          <span key={item} className="px-2 text-muted-foreground/50 text-xs font-medium">
                            ···
                          </span>
                        ),
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      aria-label="Next page"
                      disabled={page >= pageCount}
                      onClick={(event) => {
                        event.preventDefault();
                        if (page >= pageCount) return;
                        setPage((current) => Math.min(pageCount, current + 1));
                      }}
                      className={cn(
                        "flex h-9 min-w-9 items-center justify-center rounded-lg text-sm font-semibold transition-all",
                        page < pageCount
                          ? "text-foreground hover:bg-primary/10 hover:text-primary active:scale-95"
                          : "text-muted-foreground/40 cursor-not-allowed"
                      )}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  {/* Page Info */}
                  <p className="text-xs font-medium text-muted-foreground/70">
                    Page <span className="text-foreground font-semibold">{page}</span> of <span className="text-foreground font-semibold">{pageCount}</span>
                  </p>
                </nav>
              )}
            </section>
          </ScrollReveal>
        </div>
      </main>
      <ShoeModal shoe={selectedShoe} isOpen={isModalOpen} onClose={closeShoeModal} />
    </>
  );
};

export default ProductCatalog;
