import React, { useEffect, useState } from 'react';
import { fetchShoes } from '../api/shoeApi';

const AllShoes: React.FC = () => {
  const [shoes, setShoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShoes()
      .then((res) => setShoes(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading shoes...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">All Shoes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {shoes.map((s) => (
          <div key={s._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            <img src={s.images?.[0]?.url} alt={s.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="font-semibold">{s.name}</h2>
              <p className="text-sm text-muted-foreground">{s.subcategory} • {s.gender}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllShoes;
