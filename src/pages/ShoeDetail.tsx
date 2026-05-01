import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchShoe } from '../api/shoeApi';

const ShoeDetail: React.FC = () => {
  const { id } = useParams();
  const [shoe, setShoe] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchShoe(id as string).then((res) => setShoe(res.data)).catch(console.error);
  }, [id]);

  if (!shoe) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/shoes" className="text-sm text-blue-600">&larr; Back to all shoes</Link>
      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <img src={shoe.images?.[0]?.url} alt={shoe.name} className="w-full h-96 object-cover rounded" />
        <div>
          <h1 className="text-3xl font-bold">{shoe.name}</h1>
          <p className="text-sm text-muted-foreground mt-2">{shoe.gender} • {shoe.subcategory}</p>
          <p className="mt-4">{shoe.description}</p>
          {shoe.sizes?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Available Sizes</h3>
              <div className="flex gap-2 mt-2">
                {shoe.sizes.map((sz: number) => (
                  <span key={sz} className="px-3 py-1 border rounded">{sz}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoeDetail;
