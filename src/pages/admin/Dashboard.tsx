import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, ImageIcon, Layers3, Package, Sparkles, Users } from 'lucide-react';
import { fetchShoes } from '../../api/shoeApi';
import { Button } from '../../components/ui/button';
import AdminLayout from '../../components/admin/AdminLayout';
import type { Shoe } from '../../types/shoe';
import AuthContext from '../../context/AuthContext';

const Dashboard: React.FC = () => {
  const { admin, authLoading } = useContext(AuthContext);
  const [shoes, setShoes] = useState<Shoe[]>([]);

  useEffect(() => {
    if (!admin) return;

    fetchShoes()
      .then((res) => setShoes((res.data?.data || []) as Shoe[]))
      .catch(console.error);
  }, [admin]);

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

  const inventorySummary = useMemo(() => {
    const subcategories = shoes.reduce<Record<string, number>>((acc, shoe) => {
      const key = shoe.subcategory?.trim() || 'Uncategorized';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(subcategories)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [shoes]);

  const brandedCount = shoes.filter((shoe) => shoe.branded).length;
  const nonBrandedCount = Math.max(0, shoes.length - brandedCount);
  const withImages = shoes.filter((shoe) => shoe.images?.length).length;
  const noImages = Math.max(0, shoes.length - withImages);
  const maxCategoryCount = Math.max(1, ...inventorySummary.map((item) => item.count));

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
                  Create product listings with category, brand details, sizes, and image gallery support.
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

        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-sm border border-border bg-card p-5 shadow-card sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Inventory summary
              </p>
              <h2 className="mt-2 text-xl font-black text-ink">Shoes available by category</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A quick count of what is currently listed in the catalogue.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              {inventorySummary.length ? (
                inventorySummary.map((item) => (
                  <div key={item.label} className="rounded-sm border border-border bg-background p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">{item.label}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {Math.round((item.count / Math.max(1, shoes.length)) * 100)}% of inventory
                        </p>
                      </div>
                      <span className="rounded-full bg-primary px-3 py-1 text-sm font-black text-primary-foreground">
                        {item.count}
                      </span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(item.count / maxCategoryCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-sm border border-border bg-background p-6 text-center text-sm text-muted-foreground">
                  No products have been added yet.
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-sm border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Branded
                  </p>
                  <p className="mt-3 text-3xl font-black text-ink">{brandedCount}</p>
                </div>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {nonBrandedCount} non-branded or local craft listings.
              </p>
            </div>

            <div className="rounded-sm border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Coverage
                  </p>
                  <p className="mt-3 text-3xl font-black text-ink">{withImages}</p>
                </div>
                <Layers3 className="h-6 w-6 text-primary" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {noImages} products still need images.
              </p>
            </div>

            <div className="rounded-sm border border-primary/20 bg-primary/5 p-5 shadow-card sm:col-span-2 xl:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Useful next step
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Balance the inventory by adding more styles to low-count categories and keeping trending picks fresh.
              </p>
              <Button asChild className="mt-5 w-full rounded-full">
                <Link to="/admin/shoes">Review inventory</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
