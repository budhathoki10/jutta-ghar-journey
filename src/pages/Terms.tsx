import { Link } from "react-router-dom";
import { businessName, fullAddress, phoneNumber } from "@/content/site";

const Terms = () => (
  <main id="main-content" className="bg-background px-6 pb-24 pt-20 text-foreground sm:px-10">
    <div className="mx-auto max-w-5xl">
      <section className="mb-16 reveal">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Terms of service</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">The shop terms that keep service clear.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          These terms explain how inquiries, fittings and repair appointments are handled at {businessName}.
        </p>
      </section>

      <section className="space-y-10">
        <article className="reveal">
          <h2 className="text-2xl font-semibold tracking-tight">Appointment bookings</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            We hold appointments by phone and form request. A booking is confirmed when the shop replies by call or message.
          </p>
        </article>

        <article className="reveal">
          <h2 className="text-2xl font-semibold tracking-tight">Repairs and alterations</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Repair scope and timing are agreed at the desk. Work begins after the pair has been inspected. If there are changes, we let you know before proceeding.
          </p>
        </article>

        <article className="reveal">
          <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Price is determined by material, repair effort and timing. The shop provides an estimate before work begins.
          </p>
        </article>

        <article className="reveal">
          <h2 className="text-2xl font-semibold tracking-tight">Returns and follow-up</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            If a repair or fit still needs an adjustment, bring the pair back within seven days and we will review it again.
          </p>
        </article>
      </section>

      <div className="mt-14 border-t border-border pt-8 text-sm text-muted-foreground">
        <p>{businessName} &bull; {fullAddress} &bull; {phoneNumber}</p>
        <Link to="/" className="text-primary underline">Back to home</Link>
      </div>
    </div>
  </main>
);

export default Terms;
