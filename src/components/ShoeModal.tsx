import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, BadgeCheck, ImageIcon } from 'lucide-react';
import { handleProductImageError, resolveImageUrl } from '@/lib/image';
import type { Shoe } from '@/types/shoe';

type ShoeModalProps = {
  shoe: Shoe | null;
  isOpen: boolean;
  onClose: () => void;
};

const ShoeModal: React.FC<ShoeModalProps> = ({ shoe: initialShoe, isOpen, onClose }) => {
  const [localShoe, setLocalShoe] = useState<Shoe | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  const formatPrice = (price?: number | string) => {
    const amount = typeof price === 'string' ? Number(price) : price;
    if (!amount || Number.isNaN(amount)) return 'Price on request';
    return `रु ${amount.toLocaleString()}`;
  };

  useEffect(() => {
    if (!initialShoe?._id) return;

    setLocalShoe(initialShoe);
    setActiveImage(0);
  }, [isOpen, initialShoe]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (!localShoe) {
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/15 px-4 py-5 backdrop-blur-lg">
        <div className="rounded-2xl bg-white p-5 text-center shadow-2xl ring-1 ring-slate-200">
          <p className="text-slate-600">Shoe details not found.</p>
          <button
            onClick={onClose}
            className="mt-4 rounded-full bg-red-600 px-6 py-2 text-white hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const images = (localShoe.images || []).map((image) => ({
    ...image,
    url: resolveImageUrl(image.url),
  }));
  const mainImage = images[activeImage]?.url;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/15 px-3 py-4 backdrop-blur sm:px-4 sm:py-6">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className="relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-white/95 shadow-[0_32px_90px_-50px_rgba(15,23,42,0.48)] ring-1 ring-slate-200/60"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition hover:bg-slate-100"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid max-h-[88vh] gap-4 overflow-y-auto p-4 sm:grid-cols-[1.02fr_0.98fr] sm:p-5">
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 via-white to-secondary/10">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={localShoe.name}
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
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-xl border bg-white p-1 transition ${
                      activeImage === index
                        ? 'border-red-600 shadow-sm shadow-red-600/20'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${localShoe.name} ${index + 1}`}
                      onError={handleProductImageError}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                {localShoe.trending && (
                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
                    Trending
                  </span>
                )}

                {localShoe.branded && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Branded
                  </span>
                )}

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                  {localShoe.gender || 'Unisex'}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                {localShoe.name}
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                {localShoe.brand || 'Local craft'} • {localShoe.subcategory || 'Shoe'}
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Price</p>
                <p className="mt-2 text-2xl font-black text-slate-950">{formatPrice(localShoe.price)}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Reserve your favorite pair with a quick message to the shop.
                </p>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-700">
                {localShoe.description || 'A quality shoe selected for comfort, daily use, and style.'}
              </p>

              {localShoe.sizes?.length ? (
                <div className="mt-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
                    Available sizes
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {localShoe.sizes.map((size) => (
                      <span
                        key={size}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-sm"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-600">
                  Ask for sizes and stock availability.
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onClose}
                className="min-w-[10rem] rounded-full bg-slate-100 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Close
              </button>
              <Link
                to="/contact"
                onClick={onClose}
                className="min-w-[10rem] rounded-full bg-red-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-red-700 text-center"
              >
                Contact to Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoeModal;

