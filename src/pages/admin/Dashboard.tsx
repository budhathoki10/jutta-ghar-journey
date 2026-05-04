import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black mb-2">Admin Dashboard</h1>
          <p className="max-w-2xl text-sm text-foreground/80">
            Use the Add Shoe page to upload product images and create listings. Manage existing shoes from the product list.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full px-5 py-3">
            <Link to="/admin/add-shoe">Add Shoe</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-5 py-3">
            <Link to="/admin/shoes">Manage Shoes</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Total shoes</p>
          <p className="mt-4 text-3xl font-semibold">---</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Total male</p>
          <p className="mt-4 text-3xl font-semibold">---</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Total female</p>
          <p className="mt-4 text-3xl font-semibold">---</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
