import React from 'react';

const Find: React.FC = () => {
  return (
    <div className="p-8">
      <section className="max-w-5xl">
        <h1 className="text-3xl font-bold mb-4">Find Us</h1>
        <p className="text-muted-foreground mb-6">We're on Jagatsundar Marg, Kathmandu — come visit or use the map below to get directions.</p>

        <div className="w-full rounded-lg overflow-hidden border">
          <iframe
            title="Gogo Jutta Ghar - map"
            src="https://maps.google.com/maps?q=Kathmandu%20Nepal&z=15&output=embed"
            width="100%"
            height="500"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
};

export default Find;
