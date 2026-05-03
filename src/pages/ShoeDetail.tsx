import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchShoe } from '../api/shoeApi';
import { Button } from '@/components/ui/button';

const ShoeDetail: React.FC = () => {
  const { id } = useParams();
  const [shoe, setShoe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchShoe(id as string)
      .then((res) => {
        setShoe(res.data);
      })
      .catch((err) => {
        const message = err?.response?.data?.message || err?.message || 'Failed to load shoe details.';
        setError(message);
        setShoe(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Loading shoe details…</div>;
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <p className="text-sm text-destructive">{error}</p>
        <Link to="/shoes" className="text-sm text-primary underline">&larr; Back to all shoes</Link>
      </div>
    );
  }

  if (!shoe) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-4">
        <p className="text-sm text-muted-foreground">Shoe not found.</p>
        <Link to="/shoes" className="text-sm text-primary underline">&larr; Back to all shoes</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <Link to="/shoes" className="text-sm text-primary hover:underline">&larr; Back to all shoes</Link>
        {shoe.isFeatured && <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Featured</span>}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl overflow-hidden border border-border bg-card shadow-sm">
          <img
            src={shoe.images?.[0]?.url || 'https://via.placeholder.com/900x900?text=No+image'}
            alt={shoe.name}
            className="h-[540px] w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-ink">{shoe.name}</h1>
              <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">{shoe.gender}</span>
            </div>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">{shoe.subcategory}</p>
          </div>

          <div className="rounded-3xl border border-border bg-background p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="text-3xl font-semibold">Rs. {shoe.price?.toLocaleString() ?? '—'}</span>
              <span className="text-sm text-muted-foreground">Ready to order</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-foreground/80">{shoe.description || 'A fine pair of shoes ready to take you around town in comfort and style.'}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Details</p>
              <ul className="mt-4 space-y-3 text-sm text-foreground/80">
                <li><span className="font-semibold text-foreground">Brand:</span> {shoe.brand || 'Local craft'}</li>
                <li><span className="font-semibold text-foreground">Sizes:</span> {shoe.sizes?.length ? shoe.sizes.join(', ') : 'N/A'}</li>
                <li><span className="font-semibold text-foreground">Added:</span> {new Date(shoe.createdAt || Date.now()).toLocaleDateString()}</li>
              </ul>
            </div>

            {shoe.sizes?.length > 0 ? (
              <div className="rounded-3xl border border-border bg-card p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Available sizes</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {shoe.sizes.map((size: number) => (
                    <span key={size} className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild variant="outline" className="rounded-full px-6 py-3">
              <Link to="/shoes">Back to all shoes</Link>
            </Button>
            <Button asChild className="rounded-full px-6 py-3">
              <a href="/#contact">Contact to learn more</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoeDetail;
