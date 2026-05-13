import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  service: z.string().min(3, "Please tell us which service you need."),
  preferredTime: z.string().min(4, "Tell us when you would like to visit."),
  message: z.string().max(400, "Please keep the message brief.").optional(),
  phoneNumber: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      service: "",
      preferredTime: "",
      message: "",
      phoneNumber: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    if (values.phoneNumber) {
      return;
    }

    setStatus("submitting");

    await new Promise((resolve) => setTimeout(resolve, 700));

    setStatus("success");
    reset();
  };

  return (
    <div className="rounded-[28px] border border-border bg-surface p-8 shadow-card sm:p-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Reach the shoe house</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Request a fitting, repair or custom consultation.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
          Share your preferred time and the pair you would like us to review. We reply by the next business hour.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} aria-live="polite" noValidate>
        <input type="text" className="sr-only" tabIndex={-1} autoComplete="off" {...register("phoneNumber")} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-foreground" htmlFor="contact-name">
            Full name
            <Input id="contact-name" placeholder="Pratikshya Shrestha" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground" htmlFor="contact-email">
            Email address
            <Input id="contact-email" type="email" placeholder="you@example.com" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground" htmlFor="contact-service">
            Service interest
            <Input id="contact-service" placeholder="Measured fitting, repair or resole" {...register("service")} aria-invalid={!!errors.service} />
            {errors.service && <p className="text-sm text-destructive">{errors.service.message}</p>}
          </label>

          <label className="space-y-2 text-sm font-medium text-foreground" htmlFor="contact-time">
            Preferred day or time
            <Input id="contact-time" placeholder="Thursday afternoon" {...register("preferredTime")} aria-invalid={!!errors.preferredTime} />
            {errors.preferredTime && <p className="text-sm text-destructive">{errors.preferredTime.message}</p>}
          </label>
        </div>

        <label className="mt-4 space-y-2 text-sm font-medium text-foreground" htmlFor="contact-message">
          Additional details
          <Textarea id="contact-message" placeholder="Tell us what you are bringing in, or your most comfortable pair." {...register("message")} aria-invalid={!!errors.message} />
          {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
        </label>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" size="lg" className="w-full rounded-full sm:w-auto" disabled={isSubmitting}>
            {status === "submitting" ? "Sending request..." : "Send my request"}
          </Button>
          <p className="text-sm text-muted-foreground">We respond within one business hour. No spam, ever.</p>
        </div>

        {status === "success" && (
          <div className="mt-6 rounded-3xl border border-primary/20 bg-primary/5 p-5 text-sm text-foreground shadow-sm">
            <p className="font-semibold">Request received.</p>
            <p className="mt-1 text-muted-foreground">We will follow up with a call or message to confirm your booking.</p>
          </div>
        )}
      </form>
    </div>
  );
}
