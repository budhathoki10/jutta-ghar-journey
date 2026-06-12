import { X, Filter, RotateCcw, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterProps {
  search: string;
  gender: string;
  category: string;
  trendingOnly: boolean;
  sort: string;
  viewMode: "grid" | "list";
  categories: string[];
  filtersOpen: boolean;
  activeFilterCount: number;
  onSearchChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTrendingChange: (value: boolean) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (mode: "grid" | "list") => void;
  onFiltersOpenChange: (open: boolean) => void;
  onResetFilters: () => void;
}

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

export const ProductFilters = ({
  search,
  gender,
  category,
  trendingOnly,
  sort,
  viewMode,
  categories,
  filtersOpen,
  activeFilterCount,
  onSearchChange,
  onGenderChange,
  onCategoryChange,
  onTrendingChange,
  onSortChange,
  onViewModeChange,
  onFiltersOpenChange,
  onResetFilters,
}: FilterProps) => {
  const currentGenderLabel = genderOptions.find((opt) => opt.value === gender)?.label || gender;
  const currentSortLabel = sortOptions.find((opt) => opt.value === sort)?.label || sort;

  return (
    <div className="bg-background border-b border-border/50">
      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm px-4 sm:px-6 py-3 border-b border-border/30">
        <div className="mx-auto max-w-7xl">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-full text-sm focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter Bar & Controls */}
      <div className="px-4 sm:px-6 py-3 bg-card/50">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Filter Toggle */}
            <button
              onClick={() => onFiltersOpenChange(!filtersOpen)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all",
                "border border-border hover:border-primary/50",
                filtersOpen ? "bg-primary/10 text-primary border-primary/50" : "bg-background text-foreground hover:bg-card"
              )}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className={cn("h-4 w-4 transition-transform", filtersOpen && "rotate-180")} />
            </button>

            {/* Active Filters */}
            {activeFilterCount > 0 && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="ml-auto flex items-center gap-1 p-1 rounded-lg bg-muted">
              <button
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "p-1.5 rounded transition-all",
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Grid view"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                onClick={() => onViewModeChange("list")}
                className={cn(
                  "p-1.5 rounded transition-all",
                  viewMode === "list"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="List view"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="2.5" rx="1" />
                  <rect x="3" y="10.5" width="18" height="2.5" rx="1" />
                  <rect x="3" y="17" width="18" height="2.5" rx="1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Filters Panel */}
      <div
        className={cn(
          "border-t border-border/30 bg-card/30 overflow-hidden transition-all duration-300 ease-in-out",
          filtersOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        )}
      >
        <div className="px-4 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gender Filter */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2.5">
                  Category
                </label>
                <div className="flex gap-2 flex-wrap">
                  {genderOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onGenderChange(option.value)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                        gender === option.value
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background border-border hover:border-primary/50 hover:bg-card text-foreground"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategory Filter */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2.5">
                  Type
                </label>
                <select
                  value={category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    paddingRight: "28px",
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Types" : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2.5">
                  Sort by
                </label>
                <select
                  value={sort}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    paddingRight: "28px",
                  }}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trending Toggle */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2.5">
                  Collection
                </label>
                <button
                  onClick={() => onTrendingChange(!trendingOnly)}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg text-sm font-medium transition-all border flex items-center justify-center gap-2",
                    trendingOnly
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background border-border hover:border-primary/50 hover:bg-card text-foreground"
                  )}
                >
                  {trendingOnly ? "Trending Only" : "Show All"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFilterCount > 0 && !filtersOpen && (
        <div className="px-4 sm:px-6 py-3 border-t border-border/30">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-muted-foreground">Active:</span>
              {search && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-xs font-medium text-primary">Search: {search}</span>
                  <button
                    onClick={() => onSearchChange("")}
                    className="hover:text-primary/80 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {gender !== "all" && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-xs font-medium text-primary">{currentGenderLabel}</span>
                  <button
                    onClick={() => onGenderChange("all")}
                    className="hover:text-primary/80 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {category !== "all" && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-xs font-medium text-primary">{category}</span>
                  <button
                    onClick={() => onCategoryChange("all")}
                    className="hover:text-primary/80 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {trendingOnly && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <span className="text-xs font-medium text-primary">Trending</span>
                  <button
                    onClick={() => onTrendingChange(false)}
                    className="hover:text-primary/80 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
