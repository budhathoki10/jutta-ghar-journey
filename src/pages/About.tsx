import React from 'react';

const About: React.FC = () => {
  return (
    <div className="p-8">
      <section className="max-w-4xl">
        <h1 className="text-4xl font-serif font-black mb-4">A shoe shop that remembers who you are.</h1>
        <p className="text-lg text-muted-foreground">
          गोगो जुत्ता घर — a small, stubbornly good shoe store on Jagatsundar Marg.
          Quality you can feel. Soles that survive monsoon. Service that remembers your name.
        </p>
      </section>
    </div>
  );
};

export default About;
