import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, ImageIcon } from 'lucide-react';
import { fetchShoe } from '../api/shoeApi';
import { Button } from '@/components/ui/button';
import { handleProductImageError, resolveImageUrl } from '@/lib/image';

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

  const formatPrice = (price?: number) => {
    if (!price || Number.isNaN(price)) return 'Price on request';
    return `रु ${price.toLocaleString()}`;
  };

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

  const images = (shoe.images || []).map((image) => ({
    ...image,
    url: resolveImageUrl(image.url),
  }));
  const mainImage = images[activeImage]?.url;

  return (
    <main className="min-h-screen bg-background text-slate-950">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <Link
          to="/shoes"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm shadow-slate-200 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all shoes
        </Link>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] xl:gap-10">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_80px_-40px_rgba(15,23,42,0.25)]">
              <div className="aspect-[4/5] bg-gradient-to-br from-primary/10 via-white to-secondary/10">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={shoe.name}
                    onError={handleProductImageError}
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
                    className={`overflow-hidden rounded-3xl border bg-white p-1 transition ${
                      activeImage === index
                        ? 'border-slate-900 shadow-sm shadow-slate-900/10'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${shoe.name} ${index + 1}`}
                      onError={handleProductImageError}
                      className="aspect-square w-full rounded-2xl object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-20px_rgba(15,23,42,0.35)] sm:p-8">
            <div className="flex flex-wrap gap-2">
              {shoe.trending && (
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm">
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

            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {shoe.name}
            </h1>

            <p className="mt-3 text-sm font-medium text-slate-500">
              {shoe.brand || 'Local craft'} • {shoe.subcategory || 'Shoe'}
            </p>

            <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-5 shadow-sm sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Price</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{formatPrice(shoe.price)}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Available in multiple sizes and fresh stock. Tap contact to reserve your pair.
              </p>
            </div>

            <p className="mt-6 leading-7 text-slate-700">
              {shoe.description || 'A quality shoe selected for comfort, daily use, and style.'}
            </p>

            {shoe.sizes?.length ? (
              <div className="mt-8">
                <h2 className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500">
                  Available sizes
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {shoe.sizes.map((size) => (
                    <span
                      key={size}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-8 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600">
                Ask for sizes and stock availability.
              </div>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-sm">
                <p className="font-semibold text-slate-950">Category</p>
                <p className="mt-2">{shoe.subcategory || 'N/A'}</p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-sm">
                <p className="font-semibold text-slate-950">Added</p>
                <p className="mt-2">{shoe.createdAt ? new Date(shoe.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button asChild className="rounded-full bg-zinc-950 px-6 py-4 text-base font-semibold text-white transition hover:bg-slate-900">
                <Link to="/contact">Contact to order</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-slate-200 px-6 py-4 text-base font-semibold">
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
