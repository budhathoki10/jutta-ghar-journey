import { Link } from "react-router-dom";
import { businessName, email, fullAddress, phoneNumber } from "@/content/site";

const Privacy = () => (
  <main id="main-content" className="bg-background px-6 pb-24 pt-20 text-foreground sm:px-10">
    <div className="mx-auto max-w-5xl">
      <section className="mb-16 reveal">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Privacy policy</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Information stays between you and the shop.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          {businessName} only collects what is needed to confirm your appointment and service request. We do not share personal details with third parties.
        </p>
      </section>

      <section className="space-y-10">
        <article className="reveal">
          <h2 className="text-2xl font-semibold tracking-tight">What we collect</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Name, email, preferred visit time and note details are used to schedule your fitting or repair. A hidden field is included only to block automated spam.
          </p>
        </article>

        <article className="reveal">
          <h2 className="text-2xl font-semibold tracking-tight">How we use it</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            We use your information to confirm the appointment, answer your questions, and make shop service smooth. We do not keep marketing lists without your consent.
          </p>
        </article>

        <article className="reveal">
          <h2 className="text-2xl font-semibold tracking-tight">Your choices</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            If you want your details removed from our booking notes, call {phoneNumber} or email <a href={`mailto:${email}`} className="text-primary underline">{email}</a>.
          </p>
        </article>

        <article className="reveal">
          <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {businessName} &bull; {fullAddress} &bull; {phoneNumber}
          </p>
        </article>
      </section>

      <div className="mt-14 border-t border-border pt-8 text-sm text-muted-foreground">
        <Link to="/" className="text-primary underline">Back to home</Link>
      </div>
    </div>
  </main>
);

export default Privacy;
