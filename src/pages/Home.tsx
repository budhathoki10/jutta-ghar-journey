import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <main id="main-content" className="bg-background">
      {/* Hero Section */}
      <section className="px-6 sm:px-10 py-12 md:py-18 bg-gradient-to-b from-cream/50 to-background">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Content */}
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-3">
                VOL. 01 · A KATHMANDU SHOE HOUSE
              </p>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-foreground mb-4">
                Shoes that <span className="text-primary">walk</span> the city
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-lg leading-relaxed">
                गोगो जुत्ता घर — the original shoe destination on Jagatsundar Marg, Kathmandu.
              </p>

              {/* Category Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['Oxfords', 'Heels', 'Sneakers'].map((cat) => (
                  <span
                    key={cat}
                    className="px-4 py-2 rounded-full bg-destructive/15 text-destructive font-semibold text-sm hover:bg-destructive/25 transition-colors duration-200"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/shoes"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-destructive text-white font-semibold rounded-full hover:bg-destructive/90 transition-colors duration-200"
                >
                  Browse Collection
                  <span>→</span>
                </Link>
                <button className="px-6 py-3 border-2 border-foreground text-foreground font-semibold rounded-full hover:bg-foreground hover:text-background transition-colors duration-200">
                  Shop Tour
                </button>
                <button className="px-6 py-3 bg-foreground text-background font-semibold rounded-full hover:bg-foreground/90 transition-colors duration-200">
                  Google Maps
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="bg-slate-600 rounded-2xl overflow-hidden shadow-xl aspect-square md:aspect-auto md:h-80 flex items-center justify-center">
                <div className="text-center">
                  <img
                    src="/gogo-jutta-ghar-logo.png"
                    alt="GoGo Jutta Ghar"
                    className="w-24 h-24 object-contain mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="text-5xl md:text-6xl font-black text-cyan-400 drop-shadow-lg">
                    GOGO
                    <div className="text-4xl text-orange-400 mt-1">जुत्ता घर</div>
                  </div>
                </div>
                <div className="absolute top-3 right-3 bg-foreground/80 text-background px-3 py-1 rounded text-xs font-bold">
                  FEATURED
                </div>
                <div className="absolute bottom-3 right-3 bg-yellow-500 text-foreground px-3 py-1 rounded text-xs font-bold">
                  New
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-mustard/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 sm:px-10 py-12 md:py-16 bg-background border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Premium Quality', desc: 'International brands & local craftsmanship', icon: '✨' },
              { title: 'Expert Fit', desc: 'Professional fitting assistance available', icon: '👟' },
              { title: 'Fast Service', desc: 'Quick delivery across Kathmandu Valley', icon: '🚚' },
            ].map((item) => (
              <div key={item.title} className="group p-6 bg-card border border-border rounded-xl shadow-card hover:shadow-lg hover:border-primary transition-all duration-200">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 sm:px-10 py-12 md:py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Ready to Walk in Style?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Visit our shop or browse our complete collection online
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/shoes"
              className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-colors duration-200"
            >
              Browse All Shoes
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-full hover:bg-primary/5 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
