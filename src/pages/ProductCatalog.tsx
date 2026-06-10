import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, LayoutList, Search, SlidersHorizontal, X } from "lucide-react";
import { fetchShoes } from "@/api/shoeApi";
import { handleProductImageError, resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useReveal } from "@/hooks/use-reveal";
import ShoeModal from "@/components/ShoeModal";
import type { Shoe } from "@/types/shoe";

const ITEMS_PER_PAGE = 12;

const GENDER_CATEGORIES: Record<string, string[]> = {
  male: ["Slippers", "Boots", "Shoes", "Branded"],
  female: ["Doctor Chappal", "Slippers", "Sport Shoes", "Branded", "Boots", "Hills", "Close Shoes"],
  unisex: ["Branded Shoes"],
};

const genderOptions = [
  { label: "All", value: "all" },
  { label: "Men", value: "male" },
  { label: "Women", value: "female" },
  { label: "Unisex", value: "unisex" },
];

const sortOptions = [
  { label: "Best match", value: "best-match" },
  { label: "Newest", value: "newest" },
  { label: "Popular", value: "popular" },
  { label: "Name A-Z", value: "name-asc" },
  { label: "Name Z-A", value: "name-desc" },
];

const ProductCatalog = () => {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [size, setSize] = useState("all");
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
    if (gender === "male") return ["all", ...GENDER_CATEGORIES.male];
    if (gender === "female") return ["all", ...GENDER_CATEGORIES.female];
    if (gender === "unisex") return ["all", ...GENDER_CATEGORIES.unisex];
    return [
      "all",
      ...new Set(
        shoes
          .map((shoe) => shoe.subcategory?.toString() || "")
          .filter(Boolean)
          .map((item) => item.trim()),
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
      ...Array.from(new Set(shoes.flatMap((shoe) => shoe.sizes || [])))
        .sort((a, b) => a - b)
        .map(String),
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
        const shoeCategory = shoe.subcategory?.toString().toLowerCase() || "";
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
      case "newest":
        return sorted.sort((a, b) => (new Date(b.createdAt).getTime() || 0) - (new Date(a.createdAt).getTime() || 0));
      case "popular":
        return sorted.sort((a, b) => (b.sold || 0) - (a.sold || 0));
      case "name-asc":
        return sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      case "name-desc":
        return sorted.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
      default:
        return sorted;
    }
  }, [filteredShoes, sort]);

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
  }, [search, gender, category, brand, size, trendingOnly, sort]);

  useReveal([loading, paginated.length, page, viewMode]);

  const activeFilters = [
    search.trim() ? { label: `Search: ${search.trim()}`, clear: () => setSearch("") } : null,
    gender !== "all" ? { label: genderOptions.find((item) => item.value === gender)?.label || gender, clear: () => setGender("all") } : null,
    category !== "all" ? { label: category, clear: () => setCategory("all") } : null,
    brand !== "all" ? { label: brand, clear: () => setBrand("all") } : null,
    size !== "all" ? { label: `Size ${size}`, clear: () => setSize("all") } : null,
    trendingOnly ? { label: "Trending", clear: () => setTrendingOnly(false) } : null,
  ].filter(Boolean) as Array<{ label: string; clear: () => void }>;

  const activeFilterCount = activeFilters.length;

  const resetFilters = () => {
    setSearch("");
    setGender("all");
    setCategory("all");
    setBrand("all");
    setSize("all");
    setTrendingOnly(false);
  };

  const getImage = (shoe: Shoe) => resolveImageUrl(shoe.images?.[0]?.url);
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

  const SelectField = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
  }) => (
    <label className="grid gap-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
      >
        {options.map((item) => (
          <option key={item} value={item}>
            {item === "all" ? `All ${label.toLowerCase()}` : item}
          </option>
        ))}
      </select>
    </label>
  );

  const ProductTile = ({ shoe, index }: { shoe: Shoe; index: number }) => (
    <article
      className="group reveal-scale flex min-h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition duration-300 hover:shadow-md"
      style={{ transitionDelay: `${index * 45}ms` }}
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
            onError={handleProductImageError}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            {shoe.trending && (
              <span className="inline-block rounded bg-red-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-md">
                New
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
      className="group reveal-scale grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition duration-300 hover:shadow-md sm:grid-cols-[10rem_1fr_auto] sm:items-center"
      style={{ transitionDelay: `${index * 45}ms` }}
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
        <div className={cn("mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8 transition duration-300", selectedShoe ? "pointer-events-none blur-2xl" : "") }>
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

        <ScrollReveal delay={160}>
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-[1.5rem] border border-border bg-card p-4 shadow-card lg:sticky lg:top-24 lg:self-start">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary">Refine search</p>
                  <h2 className="mt-2 text-xl font-black text-ink">Find the right pair</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setFiltersOpen((open) => !open)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {filtersOpen ? "Hide" : "Show"}
                </button>
              </div>

              <div className={cn("mt-6 space-y-6", filtersOpen ? "block" : "hidden lg:block")}>
                <div className="rounded-[1.75rem] border border-border bg-background p-4">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search shoes, brand, style..."
                      className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-11 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-primary"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3 rounded-[1.75rem] border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Gender</p>
                      <p className="mt-1 text-sm text-muted-foreground">Choose a category to refine options</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {genderOptions
                      .filter((option) => option.value !== "all")
                      .map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setGender(option.value)}
                          className={cn(
                            "rounded-full border px-3 py-2 text-sm font-semibold transition",
                            gender === option.value
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                  </div>
                </div>

                {gender === "all" ? (
                  <div className="rounded-[1.75rem] border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">
                    Select a gender first to reveal filters for shoe type, brand, size, and sorting.
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 rounded-[1.75rem] border border-border bg-background p-4">
                      <SelectField label="Shoe type" value={category} onChange={setCategory} options={categories} />
                      <SelectField label="Brand" value={brand} onChange={setBrand} options={brands} />
                      <SelectField label="Size" value={size} onChange={setSize} options={sizes} />
                    </div>

                    <div className="space-y-3 rounded-[1.75rem] border border-border bg-background p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sort</p>
                      <select
                        value={sort}
                        onChange={(event) => setSort(event.target.value)}
                        className="h-11 w-full rounded-2xl border border-border bg-background px-3 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTrendingOnly((current) => !current)}
                      className={cn(
                        "inline-flex h-12 w-full items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition",
                        trendingOnly ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
                      )}
                    >
                      {trendingOnly ? "Trending only" : "Show trending"}
                    </button>
                  </>
                )}

                {(activeFilters.length > 0 || activeFilterCount > 0) && (
                  <div className="space-y-3 rounded-[1.75rem] border border-primary/20 bg-primary/10 p-4">
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.map((filter) => (
                        <button
                          key={filter.label}
                          type="button"
                          onClick={filter.clear}
                          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground transition hover:bg-primary/90"
                        >
                          {filter.label}
                          <X className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                    {activeFilters.length > 0 && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-bold text-background transition hover:bg-primary"
                      >
                        Reset all filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            </aside>

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
                <nav className="reveal flex justify-center pt-6" aria-label="Shoe pages">
                  <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled={page <= 1}
                      onClick={(event) => {
                        event.preventDefault();
                        if (page <= 1) return;
                        setPage((current) => Math.max(1, current - 1));
                      }}
                      className="flex h-8 min-w-8 items-center justify-center rounded px-2.5 text-sm font-bold text-ink transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      ←
                    </button>

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
                            "flex h-8 w-8 items-center justify-center rounded text-sm font-bold transition",
                            item === page ? "bg-red-600 text-white" : "text-ink hover:bg-secondary",
                          )}
                        >
                          {item}
                        </button>
                      ) : (
                        <span key={item} className="px-2 text-muted-foreground text-xs">
                          ...
                        </span>
                      ),
                    )}

                    <button
                      type="button"
                      aria-label="Next page"
                      disabled={page >= pageCount}
                      onClick={(event) => {
                        event.preventDefault();
                        if (page >= pageCount) return;
                        setPage((current) => Math.min(pageCount, current + 1));
                      }}
                      className="flex h-8 min-w-8 items-center justify-center rounded px-2.5 text-sm font-bold text-ink transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                </nav>
              )}
            </section>
          </div>
        </ScrollReveal>
        </div>
      </main>
      <ShoeModal shoe={selectedShoe} isOpen={isModalOpen} onClose={closeShoeModal} />
    </>
  );
};

export default ProductCatalog;
