import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Edit3,
  ImageIcon,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { deleteShoe, fetchShoes, updateShoe } from '../../api/shoeApi';
import AuthContext from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import { handleProductImageError, resolveImageUrl } from '../../lib/image';
import { useReveal } from '../../hooks/use-reveal';

type Shoe = {
  _id: string;
  name: string;
  gender: string;
  subcategory: string;
  brand?: string;
  branded?: boolean;
  trending?: boolean;
  price?: number;
  images?: Array<{ url: string; publicId?: string }>;
  sizes?: number[];
  description?: string;
};

const ITEMS_PER_PAGE = 9;

const Shoes: React.FC = () => {
  const { admin, authLoading } = useContext(AuthContext);
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const loadShoes = async () => {
    setLoading(true);

    try {
      const res = await fetchShoes();
      setShoes(res.data?.data || res.data || []);
    } catch (error) {
      console.error(error);
      alert('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShoes();
  }, []);

  const filteredShoes = useMemo(() => {
    const text = search.trim().toLowerCase();

    if (!text) return shoes;

    return shoes.filter((shoe) =>
      [shoe.name, shoe.brand, shoe.subcategory, shoe.gender]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(text))
    );
  }, [search, shoes]);

  const pageCount = Math.max(1, Math.ceil(filteredShoes.length / ITEMS_PER_PAGE));
  const paginatedShoes = filteredShoes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const showPagination = pageCount > 1;

  const paginationRange = useMemo(() => {
    const range: Array<number | string> = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(pageCount, page + 1);

    if (start > 1) range.push(1);
    if (start > 2) range.push('start-ellipsis');
    for (let i = start; i <= end; i += 1) range.push(i);
    if (end < pageCount - 1) range.push('end-ellipsis');
    if (end < pageCount) range.push(pageCount);

    return range;
  }, [page, pageCount]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount));
  }, [pageCount]);

  useEffect(() => {
    setActiveImage(0);
  }, [selectedShoe?._id]);

  useEffect(() => {
    if (!selectedShoe) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedShoe(null);
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedShoe]);

  useReveal([loading, paginatedShoes.length, page, search]);

  const stats = useMemo(
    () => ({
      total: shoes.length,
      withImages: shoes.filter((shoe) => shoe.images?.length).length,
      trending: shoes.filter((shoe) => shoe.trending).length,
    }),
    [shoes]
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;

    try {
      await deleteShoe(id);
      setShoes((items) => items.filter((shoe) => shoe._id !== id));
      setSelectedShoe((current) => (current?._id === id ? null : current));
    } catch (error) {
      console.error(error);
      alert('Failed to delete product.');
    }
  };

  const toggleTrending = async (shoe: Shoe) => {
    try {
      const updated = {
        ...shoe,
        trending: !shoe.trending,
        images: shoe.images || [],
      };

      const res = await updateShoe(shoe._id, updated);

      setShoes((items) =>
        items.map((item) => (item._id === shoe._id ? { ...item, ...res.data } : item))
      );
      setSelectedShoe((current) =>
        current?._id === shoe._id ? { ...current, ...res.data } : current
      );
    } catch (error) {
      console.error(error);
      alert('Failed to update trending status.');
    }
  };

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Restoring admin session...
      </main>
    );
  }

  if (!admin) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        Please log in to access the admin dashboard.
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-sm border border-border bg-ink text-ink-foreground shadow-soft">
          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-mustard">
                Admin products
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Manage Jutta Ghar inventory
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-foreground/75">
                Review product photos, categories, and trending status from one clean
                professional dashboard.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-sm border border-white/10 bg-white/10 p-4">
                <p className="text-xs text-ink-foreground/60">Total</p>
                <p className="mt-2 text-3xl font-black">{stats.total}</p>
              </div>

              <div className="rounded-sm border border-white/10 bg-white/10 p-4">
                <p className="text-xs text-ink-foreground/60">Images</p>
                <p className="mt-2 text-3xl font-black">{stats.withImages}</p>
              </div>

              <div className="rounded-sm border border-white/10 bg-white/10 p-4">
                <p className="text-xs text-ink-foreground/60">Trending</p>
                <p className="mt-2 text-3xl font-black">{stats.trending}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-sm border border-border bg-card p-4 shadow-card md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, brand, category, gender..."
              className="w-full rounded-sm border border-border bg-background py-3 pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-muted-foreground focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10"
            />
          </div>

          <Button asChild className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-terracotta-deep">
            <Link to="/admin/add-shoe">
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Link>
          </Button>
        </section>

        {loading ? (
          <div className="rounded-sm border border-border bg-card p-10 text-center text-muted-foreground shadow-card">
            Loading products...
          </div>
        ) : filteredShoes.length === 0 ? (
          <div className="rounded-sm border border-border bg-card p-10 text-center shadow-card">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-semibold text-ink">No products found</p>
            <p className="mt-2 text-sm text-muted-foreground">Try another search or add a new product.</p>
          </div>
        ) : (
          <>
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedShoes.map((shoe, index) => {
              const mainImage = resolveImageUrl(shoe.images?.[0]?.url);
              const meta = [
                shoe.branded && shoe.brand ? shoe.brand : null,
                shoe.subcategory,
              ].filter(Boolean).join(' • ');

              return (
                <article
                  key={shoe._id}
                  className="admin-shoe-card-reveal overflow-hidden rounded-sm border border-border bg-card shadow-card hover:shadow-soft"
                  style={{ transitionDelay: `${Math.min(index, 8) * 70}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedShoe(shoe)}
                    className="block w-full text-left"
                    aria-label={`Open ${shoe.name} details`}
                  >
                    <div className="relative aspect-[4/3] bg-secondary/40">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={shoe.name}
                          onError={handleProductImageError}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-12 w-12" />
                        </div>
                      )}

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        {shoe.trending && (
                          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                            Trending
                          </span>
                        )}

                        {shoe.branded && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs font-semibold text-ink shadow">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Branded
                          </span>
                        )}
                      </div>

                      <span className="absolute bottom-4 right-4 rounded-full bg-card/95 px-3 py-1 text-xs font-semibold text-ink shadow">
                        {shoe.images?.length || 0} images
                      </span>
                    </div>
                  </button>

                  <div className="space-y-4 p-5">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <button type="button" onClick={() => setSelectedShoe(shoe)} className="text-left">
                          <h2 className="line-clamp-1 text-lg font-bold text-ink transition hover:text-primary">
                            {shoe.name}
                          </h2>
                          </button>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {meta || 'Collection'}
                          </p>
                        </div>
                      </div>

                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        {shoe.gender}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setSelectedShoe(shoe)}
                      >
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Details
                      </Button>

                      <Button
                        type="button"
                        variant={shoe.trending ? 'default' : 'outline'}
                        className="rounded-full"
                        onClick={() => toggleTrending(shoe)}
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {shoe.trending ? 'Trending' : 'Mark trending'}
                      </Button>

                      <Button asChild variant="outline" className="rounded-full">
                        <Link to={`/admin/edit-shoe/${shoe._id}`}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleDelete(shoe._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {showPagination && (
            <nav className="flex flex-col items-center gap-4 pt-2" aria-label="Product pages">
              <div className="inline-flex items-center gap-2 rounded-sm border border-border bg-card p-2 shadow-card">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="flex h-9 min-w-9 items-center justify-center rounded-sm text-sm font-semibold text-ink transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:text-muted-foreground/40 disabled:hover:bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1">
                  {paginationRange.map((item) =>
                    typeof item === 'number' ? (
                      <button
                        key={item}
                        type="button"
                        aria-label={`Page ${item}`}
                        aria-current={item === page ? 'page' : undefined}
                        onClick={() => setPage(item)}
                        className={`flex h-9 w-9 items-center justify-center rounded-sm text-sm font-semibold transition ${
                          item === page
                            ? 'bg-primary text-primary-foreground shadow'
                            : 'text-ink hover:bg-muted'
                        }`}
                      >
                        {item}
                      </button>
                    ) : (
                      <span key={item} className="px-2 text-xs font-semibold text-muted-foreground">
                        ...
                      </span>
                    )
                  )}
                </div>

                <button
                  type="button"
                  aria-label="Next page"
                  disabled={page >= pageCount}
                  onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                  className="flex h-9 min-w-9 items-center justify-center rounded-sm text-sm font-semibold text-ink transition hover:bg-primary/10 hover:text-primary disabled:cursor-not-allowed disabled:text-muted-foreground/40 disabled:hover:bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs font-medium text-muted-foreground">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filteredShoes.length)} of {filteredShoes.length} products
              </p>
            </nav>
          )}
          </>
        )}
      </div>

      {selectedShoe && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/30 px-3 py-5 backdrop-blur-md sm:px-6">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close product details"
            onClick={() => setSelectedShoe(null)}
          />

          {resolveImageUrl(selectedShoe.images?.[0]?.url) && (
            <img
              src={resolveImageUrl(selectedShoe.images?.[0]?.url)}
              alt=""
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 h-full w-full scale-110 object-cover opacity-20 blur-2xl"
            />
          )}

          <section
            className="relative my-auto grid w-full max-w-5xl overflow-hidden rounded-sm border border-border bg-card/95 shadow-soft lg:grid-cols-[1.05fr_0.95fr]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedShoe(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-card/90 p-2 text-muted-foreground shadow transition hover:bg-muted hover:text-ink"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-3 bg-background/70 p-4 sm:p-5">
              <div className="overflow-hidden rounded-sm border border-border bg-secondary/30">
                <div className="aspect-[4/3]">
                  {selectedShoe.images?.[activeImage]?.url ? (
                    <img
                      src={resolveImageUrl(selectedShoe.images[activeImage].url)}
                      alt={selectedShoe.name}
                      onError={handleProductImageError}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-16 w-16" />
                    </div>
                  )}
                </div>
              </div>

              {(selectedShoe.images?.length || 0) > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {selectedShoe.images?.map((image, index) => (
                    <button
                      key={`${image.url}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      className={`overflow-hidden rounded-sm border bg-card p-1 transition ${
                        activeImage === index ? 'border-primary shadow' : 'border-border hover:border-primary/60'
                      }`}
                    >
                      <img
                        src={resolveImageUrl(image.url)}
                        alt={`${selectedShoe.name} ${index + 1}`}
                        onError={handleProductImageError}
                        className="aspect-square w-full rounded-sm object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between p-5 sm:p-7">
              <div>
                <div className="flex flex-wrap gap-2 pr-10">
                  {selectedShoe.trending && (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Trending
                    </span>
                  )}
                  {selectedShoe.branded && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-ink">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Branded
                    </span>
                  )}
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold capitalize text-muted-foreground">
                    {selectedShoe.gender}
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-black leading-tight text-ink">
                  {selectedShoe.name}
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {[selectedShoe.branded && selectedShoe.brand ? selectedShoe.brand : null, selectedShoe.subcategory]
                    .filter(Boolean)
                    .join(' • ') || 'Collection'}
                </p>

                <div className="mt-5 rounded-sm border border-border bg-background p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Description
                  </p>
                  <p className="mt-3 text-sm leading-6 text-ink">
                    {selectedShoe.description || 'No description added yet.'}
                  </p>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Sizes
                  </p>
                  {selectedShoe.sizes?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedShoe.sizes.map((size) => (
                        <span
                          key={size}
                          className="rounded-full border border-border bg-background px-3 py-1.5 text-sm font-semibold text-ink"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-sm border border-border bg-background p-3 text-sm text-muted-foreground">
                      Size information has not been added.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={selectedShoe.trending ? 'default' : 'outline'}
                  className="rounded-full"
                  onClick={() => toggleTrending(selectedShoe)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {selectedShoe.trending ? 'Trending' : 'Mark trending'}
                </Button>

                <Button asChild variant="outline" className="rounded-full">
                  <Link to={`/admin/edit-shoe/${selectedShoe._id}`}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                  onClick={() => handleDelete(selectedShoe._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  );
};

export default Shoes;
