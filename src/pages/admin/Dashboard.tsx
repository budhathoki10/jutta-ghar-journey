import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImageIcon, Package, Sparkles, Users } from 'lucide-react';
import { fetchShoes } from '../../api/shoeApi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import { resolveImageUrl } from '../../lib/image';
import type { Shoe } from '../../types/shoe';

const Dashboard: React.FC = () => {
  const [shoes, setShoes] = useState<Shoe[]>([]);

  useEffect(() => {
    fetchShoes()
      .then((res) => setShoes((res.data?.data || []) as Shoe[]))
      .catch(console.error);
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total shoes', value: shoes.length, icon: Package },
      { label: "Men's category", value: shoes.filter((shoe) => shoe.gender === 'male').length, icon: Users },
      { label: "Women's category", value: shoes.filter((shoe) => shoe.gender === 'female').length, icon: Users },
      { label: 'With images', value: shoes.filter((shoe) => shoe.images?.length).length, icon: ImageIcon },
    ],
    [shoes]
  );

  const trending = shoes.filter((shoe) => shoe.trending).length;

  const latestRandomShoes = useMemo(() => {
    const latest = [...shoes]
      .filter((shoe) => shoe.createdAt)
      .sort((a, b) =>
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      )
      .slice(0, 12);

    for (let i = latest.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [latest[i], latest[j]] = [latest[j], latest[i]];
    }

    return latest.slice(0, 4);
  }, [shoes]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="grid gap-5 lg:grid-cols-[1.75fr_1fr]">
          <section className="rounded-sm border border-border bg-card p-5 shadow-card sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Admin dashboard</p>
            <h1 className="mt-3 text-3xl font-black text-ink sm:text-4xl">Manage your catalogue with clarity.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              A polished controls panel for adding products, reviewing inventory, and keeping the storefront fresh.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-sm border border-primary/15 bg-primary/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Quick add</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Create product listings with complete details, pricing, and image gallery support.
                </p>
              </div>
              <div className="rounded-sm border border-border bg-background p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Trending now</p>
                <p className="mt-3 flex items-center gap-2 text-3xl font-black text-ink">
                  <Sparkles className="h-6 w-6 text-primary" />
                  {trending}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Products currently highlighted as new or popular.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-sm border border-border bg-card p-5 shadow-card sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Quick actions</p>
            <div className="mt-6 space-y-3">
              <Button asChild className="w-full rounded-full px-5 py-3">
                <Link to="/admin/add-shoe">Add Shoe</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full px-5 py-3">
                <Link to="/admin/shoes">Manage Shoes</Link>
              </Button>
            </div>
          </section>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="rounded-sm border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">{stat.label}</p>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-4 text-3xl font-black text-ink">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="rounded-sm border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Latest random arrivals</p>
              <h2 className="mt-2 text-xl font-black text-ink">Fresh shoes added automatically</h2>
            </div>
            <span className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-ink">
              New latest random picks
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {latestRandomShoes.length ? (
              latestRandomShoes.map((shoe) => (
                <div key={shoe._id} className="rounded-3xl border border-border bg-white p-4 shadow-sm">
                  <div className="aspect-square overflow-hidden rounded-3xl bg-slate-100">
                    <img
                      src={resolveImageUrl(shoe.images?.[0]?.url)}
                      alt={shoe.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{shoe.subcategory || 'Shoe'}</p>
                    <h3 className="mt-2 text-base font-bold text-ink line-clamp-2">{shoe.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-slate-700">{shoe.brand || 'Local craft'}</p>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {shoe.sizes?.length ? `Sizes ${Math.min(...shoe.sizes)}-${Math.max(...shoe.sizes)}` : 'Size info pending'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-border bg-slate-50 p-6 text-center text-sm text-slate-600">
                No latest shoes available yet. Add a new product to refresh this view.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-sm border border-border bg-card p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Admin note</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Use the quick actions above to add and manage shoe listings. Your inventory overview helps you prioritize product updates and featured launches.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-ink">
              Keep images clear and prices current.
            </span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
