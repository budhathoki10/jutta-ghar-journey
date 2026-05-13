import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const Dashboard: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
        <section className="rounded-[2rem] border border-border bg-card p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Admin dashboard</p>
          <h1 className="mt-3 text-4xl font-black text-ink">Manage your catalogue with clarity.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground/80">
            A polished controls panel for adding products, reviewing inventory, and keeping the storefront fresh.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-primary/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Quick add</p>
              <p className="mt-3 text-sm text-foreground/80">
                Create product listings with complete details, pricing, and image gallery support.
              </p>
            </div>
            <div className="rounded-3xl bg-secondary/5 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-secondary">Store updates</p>
              <p className="mt-3 text-sm text-foreground/80">
                Keep featured collections updated and review product details before publishing.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Quick actions</p>
          <div className="mt-6 space-y-4">
            <Button asChild className="w-full rounded-full px-5 py-3">
              <Link to="/admin/add-shoe">Add Shoe</Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full px-5 py-3">
              <Link to="/admin/shoes">Manage Shoes</Link>
            </Button>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Total shoes</p>
          <p className="mt-4 text-3xl font-semibold">---</p>
        </div>
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Men's category</p>
          <p className="mt-4 text-3xl font-semibold">---</p>
        </div>
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Women's category</p>
          <p className="mt-4 text-3xl font-semibold">---</p>
        </div>
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Featured items</p>
          <p className="mt-4 text-3xl font-semibold">---</p>
        </div>
      </div>

      <div className="mt-6 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Admin note</p>
            <p className="mt-3 text-sm leading-7 text-foreground/80">
              Use the quick actions above to add and manage shoe listings. Your inventory overview helps you prioritize product updates and featured launches.
            </p>
          </div>
          <span className="inline-flex items-center rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground">
            Keep the storefront polished with small product containers and curated image-led listings.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
