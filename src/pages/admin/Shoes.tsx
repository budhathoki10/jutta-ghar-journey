import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Edit3, Star, StarOff, PlusCircle } from "lucide-react";
import { fetchShoes, deleteShoe, updateShoe } from "@/api/shoeApi";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const AdminShoes = () => {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [shoes, setShoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const pageCount = Math.max(1, Math.ceil(shoes.length / ITEMS_PER_PAGE));
  const paginatedShoes = shoes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const trendingCount = shoes.filter((shoe) => shoe.trending).length;

  const paginationRange = useMemo(() => {
    const range: Array<number | string> = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(pageCount, page + 1);

    if (start > 1) range.push(1);
    if (start > 2) range.push("start-ellipsis");
    for (let i = start; i <= end; i += 1) range.push(i);
    if (end < pageCount - 1) range.push("end-ellipsis");
    if (end < pageCount) range.push(pageCount);

    return range;
  }, [page, pageCount]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login");
      return;
    }
    fetchShoes()
      .then((res) => setShoes(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [admin, navigate]);

  const refresh = () => {
    setLoading(true);
    fetchShoes()
      .then((res) => setShoes(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const removeShoe = async (id: string) => {
    if (!confirm("Delete this product permanently?")) return;
    await deleteShoe(id);
    refresh();
  };

  const toggleTrending = async (shoe: any) => {
    await updateShoe(shoe._id, { trending: !shoe.trending });
    refresh();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Admin panel</p>
          <h1 className="mt-3 text-3xl font-black text-ink">Manage products</h1>
          <p className="mt-2 max-w-2xl text-sm text-foreground/70">
            Review inventory, update trending items, and keep the product catalog polished for your store.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 justify-start lg:justify-end">
          <Button asChild className="rounded-full px-4 py-3" variant="secondary">
            <Link to="/admin/add-shoe"><PlusCircle className="mr-2 h-4 w-4" /> Add Shoe</Link>
          </Button>
          <Button onClick={refresh} variant="outline" className="rounded-full px-4 py-3">Refresh</Button>
        </div>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Total products</p>
          <p className="mt-3 text-3xl font-bold text-ink">{shoes.length}</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Trending now</p>
          <p className="mt-3 text-3xl font-bold text-ink">{trendingCount}</p>
        </div>
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Showing page</p>
          <p className="mt-3 text-3xl font-bold text-ink">{page} / {pageCount}</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">Loading products…</div>
      ) : (
        <>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-background">
                <tr>
                  <th className="p-4 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">Product</th>
                  <th className="p-4 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">Category</th>
                  <th className="p-4 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">Price</th>
                  <th className="p-4 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">Trending</th>
                  <th className="p-4 text-left text-xs uppercase tracking-[0.3em] text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {paginatedShoes.map((shoe) => (
                  <tr key={shoe._id} className="transition hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-3xl bg-[#f5f5f5]">
                          <img
                            src={shoe.images?.[0]?.url || "https://via.placeholder.com/240x240?text=No+image"}
                            alt={shoe.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{shoe.name}</p>
                          <p className="text-xs text-muted-foreground">{shoe.branded ? shoe.brand || "Branded" : "Non-branded"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground">{shoe.subcategory || 'Other'}</p>
                      <p className="text-xs text-muted-foreground">{shoe.gender || 'Unisex'}</p>
                    </td>
                    <td className="p-4 text-sm font-semibold text-foreground">Rs {shoe.price ?? 'N/A'}</td>
                    <td className="p-4 text-sm text-foreground">{shoe.trending ? 'Yes' : 'No'}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => toggleTrending(shoe)} variant={shoe.trending ? "secondary" : "outline"} className="rounded-full px-3 py-2 text-sm">
                          {shoe.trending ? <><Star className="mr-2 h-4 w-4" />Trending</> : <><StarOff className="mr-2 h-4 w-4" />Mark</>}
                        </Button>
                        <Button asChild variant="outline" className="rounded-full px-3 py-2 text-sm">
                          <Link to={`/admin/edit-shoe/${shoe._id}`}>Edit</Link>
                        </Button>
                        <Button onClick={() => removeShoe(shoe._id)} variant="destructive" className="rounded-full px-3 py-2 text-sm">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {shoes.length > 0 && (
            <Pagination className="mt-6 flex flex-col gap-3 rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {Math.min(shoes.length, (page - 1) * ITEMS_PER_PAGE + 1)}–{Math.min(shoes.length, page * ITEMS_PER_PAGE)} of {shoes.length} products
              </span>
              <PaginationContent className="justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={page <= 1}
                    onClick={(e) => {
                      e.preventDefault();
                      if (page <= 1) return;
                      setPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>
                {paginationRange.map((item) =>
                  typeof item === "number" ? (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={item === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(item as number);
                        }}
                        size="default"
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={page >= pageCount}
                    onClick={(e) => {
                      e.preventDefault();
                      if (page >= pageCount) return;
                      setPage((p) => Math.min(pageCount, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default AdminShoes;
