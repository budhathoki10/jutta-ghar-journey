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
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] bg-zinc-950 text-white shadow-2xl">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">
                Admin products
              </p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Manage Jutta Ghar inventory
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
                Review product photos, prices, categories, and trending status from one clean
                professional dashboard.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs text-zinc-400">Total</p>
                <p className="mt-2 text-3xl font-bold">{stats.total}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs text-zinc-400">Images</p>
                <p className="mt-2 text-3xl font-bold">{stats.withImages}</p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs text-zinc-400">Trending</p>
                <p className="mt-2 text-3xl font-bold">{stats.trending}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, brand, category, gender..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/10"
            />
          </div>

          <Button asChild className="rounded-full bg-zinc-950 px-6 hover:bg-zinc-800">
            <Link to="/admin/add-shoe">
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Link>
          </Button>
        </section>

        {loading ? (
          <div className="rounded-[2rem] bg-white p-10 text-center text-slate-500 shadow-sm">
            Loading products...
          </div>
        ) : filteredShoes.length === 0 ? (
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm">
            <ImageIcon className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-lg font-semibold text-slate-950">No products found</p>
            <p className="mt-2 text-sm text-slate-500">Try another search or add a new product.</p>
          </div>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredShoes.map((shoe) => {
              const mainImage = shoe.images?.[0]?.url;

              return (
                <article
                  key={shoe._id}
                  className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] bg-slate-100">
                    {mainImage ? (
                      <img src={mainImage} alt={shoe.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      {shoe.trending && (
                        <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white shadow">
                          Trending
                        </span>
                      )}

                      {shoe.branded && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Branded
                        </span>
                      )}
                    </div>

                    <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
                      {shoe.images?.length || 0} images
                    </span>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="line-clamp-1 text-lg font-bold text-slate-950">
                            {shoe.name}
                          </h2>
                          <p className="mt-1 text-sm text-slate-500">
                            {shoe.brand || 'Local craft'} • {shoe.subcategory}
                          </p>
                        </div>

                        <p className="whitespace-nowrap text-lg font-bold text-slate-950">
                          Rs. {shoe.price?.toLocaleString() ?? '—'}
                        </p>
                      </div>

                      <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
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
                        <Link to={`/admin/shoes/${shoe._id}/edit`}>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
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
    </main>
  );
};

export default Shoes;