import React, { useEffect } from 'react';
import ContactSection from '@/components/ContactSection';
import StorySection from '@/components/StorySection';

const Home: React.FC = () => {
  useEffect(() => {
    // Handle hash navigation with smooth scroll
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [window.location.hash]);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="hero relative min-h-[90vh] md:min-h-screen bg-gradient-to-br from-ink/5 via-background to-terracotta/5 flex items-center justify-center px-4 sm:px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl w-full text-center space-y-4 sm:space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-tight">Your Shoe Story</h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/70 max-w-2xl mx-auto">
            Premium footwear for every journey. Quality, fit, and honest advice since 2004.
          </p>
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
            <a href="/catalog" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              Browse Collection
            </a>
            <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-primary/50 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary transition hover:bg-primary/5">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink mb-8 sm:mb-12">New Arrivals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border/50 hover:border-primary/50 transition group cursor-pointer">
                <div className="h-48 sm:h-56 md:h-64 bg-gradient-to-br from-terracotta/20 to-primary/20 flex items-center justify-center">
                  <span className="text-5xl sm:text-6xl">👟</span>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-bold text-base sm:text-lg text-ink mb-2">Premium Shoe #{i}</h3>
                  <p className="text-xs sm:text-sm text-foreground/70 mb-3 sm:mb-4">Crafted for comfort and style</p>
                  <p className="text-base sm:text-lg font-bold text-primary">₹2,499</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StorySection />

      <ContactSection id="contact" />
    </div>
  );
};

export default Home;
