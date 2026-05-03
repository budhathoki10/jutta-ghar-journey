import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Trash2, Edit3, Star, StarOff, PlusCircle } from "lucide-react";
import { fetchShoes, deleteShoe, updateShoe } from "@/api/shoeApi";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const AdminShoes = () => {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [shoes, setShoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Admin panel</p>
          <h1 className="mt-3 text-3xl font-black text-ink">Manage products</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full px-4 py-3" variant="secondary">
            <Link to="/admin/add-shoe"><PlusCircle className="mr-2 h-4 w-4" /> Add Shoe</Link>
          </Button>
          <Button onClick={refresh} variant="outline" className="rounded-full px-4 py-3">Refresh</Button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground">Loading products…</div>
      ) : (
        <div className="grid gap-6">
          {shoes.map((shoe) => (
            <div key={shoe._id} className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:items-center sm:gap-5">
                <div className="h-28 w-28 overflow-hidden rounded-3xl bg-muted">
                  <img src={shoe.images?.[0]?.url || "https://via.placeholder.com/240x240?text=No+image"} alt={shoe.name} className="h-full w-full object-cover" />
                </div>
                <div className="mt-4 sm:mt-0">
                  <h2 className="text-xl font-semibold text-ink">{shoe.name}</h2>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">{shoe.subcategory} · {shoe.gender}</p>
                  <p className="mt-2 text-sm text-foreground/80">Brand: {shoe.branded ? shoe.brand || "Branded" : "Non-branded"}</p>
                  <p className="mt-1 text-sm text-foreground/80">Sizes: {shoe.sizes?.length ? `${Math.min(...shoe.sizes)}–${Math.max(...shoe.sizes)}` : "Not set"}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-0">
                <Button onClick={() => toggleTrending(shoe)} variant={shoe.trending ? "secondary" : "outline"} className="rounded-full px-3 py-2 text-sm">
                  {shoe.trending ? <><Star className="mr-2 h-4 w-4" /> Trending</> : <><StarOff className="mr-2 h-4 w-4" /> Mark trending</>}
                </Button>
                <Button asChild variant="outline" className="rounded-full px-3 py-2 text-sm">
                  <Link to={`/admin/edit-shoe/${shoe._id}`}><Edit3 className="mr-2 h-4 w-4" />Edit</Link>
                </Button>
                <Button onClick={() => removeShoe(shoe._id)} variant="destructive" className="rounded-full px-3 py-2 text-sm">
                  <Trash2 className="mr-2 h-4 w-4" />Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminShoes;
