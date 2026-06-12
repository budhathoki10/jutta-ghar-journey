import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft } from "lucide-react";

const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  const ref = params.get("ref") ?? "—";
  const amount = params.get("amount") ?? "0";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center animate-fade-in-up">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">Payment received</p>
        <h1 className="font-serif text-5xl font-black tracking-tight">Dhanyabad!</h1>
        <p className="mt-4 max-w-sm text-muted-foreground">
          Your order is confirmed. We'll message you on the number you provided once
          your shoes are packed and ready.
        </p>

        <div className="mt-10 w-full rounded-sm border border-border bg-card p-6 text-left">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Paid via</span>
            <div className="text-sm font-semibold text-muted-foreground">eSewa</div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference</span>
              <span className="font-mono">{ref}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-serif text-lg font-bold">
              <span>Amount</span>
              <span className="tabular-nums">Rs. {Number(amount).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <Button asChild size="lg" className="mt-10 h-12 rounded-full bg-ink text-ink-foreground hover:bg-ink/90">
          <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back to the shop</Link>
        </Button>
      </main>
    </div>
  );
};

export default CheckoutSuccess;