import { Link } from "react-router-dom";

const ThankYou = () => (
  <main id="main-content" className="bg-background px-6 pb-24 pt-20 text-foreground sm:px-10">
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Request received</p>
      <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Thank you. We will be in touch shortly.</h1>
      <p className="mt-6 text-base leading-8 text-muted-foreground">
        Your booking request is with the shop. Expect a message or call before the next opening hour.
      </p>
      <div className="mt-10 flex justify-center gap-4">
        <Link to="/" className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
          Return to home
        </Link>
        <Link to="/contact" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
          Contact the shop again
        </Link>
      </div>
    </div>
  </main>
);

export default ThankYou;
