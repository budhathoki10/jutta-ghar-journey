import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Minus, Plus, Trash2, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";

const DELIVERY = 150;

const Checkout = () => {
  const { items, setQty, remove, total, clear } = useCart();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const grandTotal = items.length ? total + DELIVERY : 0;

  const handleEsewa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill in your delivery details.");
      return;
    }
    setPaying(true);
    // Mock eSewa redirect — no real API call.
    setTimeout(() => {
      const ref = "ESW-" + Math.random().toString(36).slice(2, 10).toUpperCase();
      const amount = grandTotal;
      clear();
      navigate(`/checkout/success?ref=${ref}&amount=${amount}`);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-black tracking-tight">GoGo</span>
            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Jutta Ghar</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 lg:grid-cols-12">
        {/* Left — details */}
        <section className="lg:col-span-7">
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">§ Checkout</p>
          <h1 className="mb-8 font-serif text-4xl font-black tracking-tight md:text-5xl">
            Almost yours.
          </h1>

          <form onSubmit={handleEsewa} className="space-y-6">
            <div className="space-y-4 rounded-sm border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold">Delivery details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Sita Sharma"
                    autoComplete="name"
                    maxLength={80}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Mobile (eSewa)</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="98XXXXXXXX"
                    inputMode="tel"
                    maxLength={15}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Delivery address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Jagatsundar Marg, Kathmandu"
                  maxLength={160}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-sm border border-border bg-card p-6">
              <h2 className="font-serif text-xl font-bold">Payment method</h2>
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-sm border-2 border-primary bg-primary/5 p-4 transition-colors">
                <div className="flex items-center gap-4">
                  <input type="radio" name="pay" defaultChecked className="h-4 w-4 accent-primary" />
                  <div>
                    <div className="font-medium">eSewa</div>
                    <div className="text-xs text-muted-foreground">Nepal's most trusted digital wallet</div>
                  </div>
                </div>
                <img
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='24'%3E%3Ctext x='8' y='16' font-size='12' fill='%23666'%3EeSewa%3C/text%3E%3C/svg%3E"
                  alt="eSewa"
                  width={80}
                  height={32}
                  loading="lazy"
                  className="h-8 w-auto object-contain"
                />
              </label>
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                You'll be redirected to eSewa to complete payment securely.
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={paying || !items.length}
              className="h-14 w-full rounded-full bg-[#60BB46] text-white text-base font-semibold hover:bg-[#4fa239] disabled:opacity-60"
            >
              {paying ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Redirecting to eSewa…
                </span>
              ) : (
                <>Pay Rs. {grandTotal.toLocaleString()} with eSewa</>
              )}
            </Button>
          </form>
        </section>

        {/* Right — summary */}
        <aside className="lg:col-span-5">
          <div className="sticky top-6 space-y-4 rounded-sm border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-bold">Your bag</h2>

            {items.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Your bag is empty. <Link to="/#collection" className="text-primary underline">Browse the collection</Link>.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {items.map((it) => (
                  <li key={it.id} className="flex gap-4 py-4">
                    <img
                      src={it.img}
                      alt={it.name}
                      width={80}
                      height={100}
                      loading="lazy"
                      className="h-20 w-16 rounded-sm object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium leading-tight">{it.name}</div>
                          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                            {it.category}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(it.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            onClick={() => setQty(it.id, it.qty - 1)}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-6 text-center text-sm tabular-nums">{it.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(it.id, it.qty + 1)}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-medium tabular-nums">
                          Rs. {(it.price * it.qty).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Truck className="h-3.5 w-3.5" /> Inside Valley delivery
                </span>
                <span className="tabular-nums">Rs. {items.length ? DELIVERY : 0}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-serif text-lg font-bold">
                <span>Total</span>
                <span className="tabular-nums">Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Checkout;