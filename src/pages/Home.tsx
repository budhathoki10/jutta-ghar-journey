import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="p-8">
      <section className="hero h-96 bg-gray-900 text-white rounded-lg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Your Shoe Shop</h1>
          <p className="mt-2 text-lg">Curated shoes for every step</p>
        </div>
      </section>
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">New Arrivals</h2>
        {/* Featured shoes grid will go here */}
      </section>
    </div>
  );
};

export default Home;
