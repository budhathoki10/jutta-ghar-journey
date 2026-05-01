import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">Total Shoes: ---</div>
        <div className="p-4 border rounded">Total Male: ---</div>
        <div className="p-4 border rounded">Total Female: ---</div>
      </div>
    </div>
  );
};

export default Dashboard;
