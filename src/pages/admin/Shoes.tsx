import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  Edit3,
  ImageIcon,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { deleteShoe, fetchShoes, updateShoe } from '../../api/shoeApi';
import AuthContext from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import { handleProductImageError, resolveImageUrl } from '../../lib/image';

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

const Shoes: React.FC = () => {
  const { admin } = useContext(AuthContext);
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
    } catch (error) {
      console.error(error);
      alert('Failed to update trending status.');
    }
  };

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
                Review product photos, prices, categories, and trending status from one clean
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
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredShoes.map((shoe) => {
              const mainImage = resolveImageUrl(shoe.images?.[0]?.url);

              return (
                <article
                  key={shoe._id}
                  className="overflow-hidden rounded-sm border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-soft"
                >
                  <div className="relative aspect-[4/3] bg-secondary/40">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={shoe.name}
                        onError={handleProductImageError}
                        className="h-full w-full object-cover"
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

                  <div className="space-y-4 p-5">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="line-clamp-1 text-lg font-bold text-ink">
                            {shoe.name}
                          </h2>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {shoe.brand || 'Local craft'} • {shoe.subcategory}
                          </p>
                        </div>

                        <p className="whitespace-nowrap text-lg font-bold text-primary">
                          Rs. {shoe.price?.toLocaleString() ?? '—'}
                        </p>
                      </div>

                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        {shoe.gender}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
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
        )}
      </div>
    </AdminLayout>
  );
};

export default Shoes;
