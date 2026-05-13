import React, { useEffect } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useReveal } from '@/hooks/use-reveal';
import ContactSection from '@/components/ContactSection';

const Contact: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useReveal();

  return (
    <div className="space-y-16">
      <section className="hero relative min-h-screen bg-gradient-to-br from-ink/5 via-background to-terracotta/5 flex items-center justify-center px-6 py-20">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <ScrollReveal>
            <p className="text-sm uppercase tracking-[0.3em] text-terracotta">§ 05 — सम्पर्क · Contact</p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h1 className="text-5xl md:text-6xl font-black text-ink leading-tight">Talk directly with the team.</h1>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto">
              For direct orders, Instagram enquiries, and WhatsApp support — these are the people ready to help.
            </p>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <ScrollReveal delay={300}>
              <a href="tel:+9779841898731" className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                Call Store Line
              </a>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <a href="https://wa.me/9779865481109" className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-8 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5">
                WhatsApp Support
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ContactSection id="contact" />
    </div>
  );
};

export default Contact;
