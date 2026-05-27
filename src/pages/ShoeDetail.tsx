import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, ImageIcon } from 'lucide-react';
import { fetchShoe } from '../api/shoeApi';
import { Button } from '@/components/ui/button';

type Shoe = {
  _id: string;
  name: string;
  gender?: string;
  subcategory?: string;
  brand?: string;
  branded?: boolean;
  trending?: boolean;
  isFeatured?: boolean;
  price?: number;
  description?: string;
  sizes?: number[];
  images?: Array<{ url: string }>;
  createdAt?: string;
};

const ShoeDetail: React.FC = () => {
  const { id } = useParams();
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetchShoe(id)
      .then((res) => {
        setShoe(res.data);
        setActiveImage(0);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err?.message || 'Failed to load shoe details.');
        setShoe(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center text-slate-500">
        Loading shoe details...
      </main>
    );
  }

  if (error || !shoe) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-lg font-semibold text-slate-950">
          {error || 'Shoe not found.'}
        </p>

        <Button asChild className="mt-6 rounded-full">
          <Link to="/shoes">Back to all shoes</Link>
        </Button>
      </main>
    );
  }

  const images = shoe.images || [];
  const mainImage = images[activeImage]?.url;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/shoes"
          className="reveal inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all shoes
        </Link>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-4 reveal-left">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="aspect-square bg-slate-100">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={shoe.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <ImageIcon className="h-16 w-16" />
                  </div>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                {images.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-2xl border bg-white p-1 transition ${
                      activeImage === index
                        ? 'border-zinc-950 ring-4 ring-zinc-950/10'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${shoe.name} ${index + 1}`}
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2rem] sm:p-6 lg:p-8 reveal-right">
            <div className="flex flex-wrap gap-2">
              {shoe.trending && (
                <span className="rounded-full bg-zinc-950 px-3 py-1 text-xs font-semibold text-white">
                  Trending
                </span>
              )}

              {shoe.branded && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Branded
                </span>
              )}

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                {shoe.gender || 'Unisex'}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              {shoe.name}
            </h1>

            <p className="mt-3 text-sm font-medium text-slate-500">
              {shoe.brand || 'Local craft'} • {shoe.subcategory || 'Shoe'}
            </p>

            <p className="mt-6 text-4xl font-bold text-slate-950">
              Rs. {shoe.price?.toLocaleString() ?? '—'}
            </p>

            <p className="mt-6 leading-7 text-slate-600">
              {shoe.description ||
                'A quality shoe selected for comfort, daily use, and style.'}
            </p>

            {shoe.sizes?.length ? (
              <div className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                  Available sizes
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {shoe.sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-600 sm:rounded-3xl sm:p-5 sm:text-sm">
              <p>
                <span className="font-semibold text-slate-950">Category:</span>{' '}
                {shoe.subcategory || 'N/A'}
              </p>

              <p>
                <span className="font-semibold text-slate-950">Added:</span>{' '}
                {shoe.createdAt ? new Date(shoe.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            <div className="mt-8 grid gap-3 xs:grid-cols-2 sm:flex sm:flex-row">
              <Button asChild className="rounded-full bg-zinc-950 px-6 hover:bg-zinc-800">
                <Link to="/contact">Contact to order</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-6">
                <Link to="/shoes">Continue shopping</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ShoeDetail;
