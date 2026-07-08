import React from 'react';

export default function FarmPartners() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 fade-in text-left text-neutral-600 space-y-6">
      <h1 className="font-outfit font-extrabold text-4xl text-neutral-800 mb-8 border-b border-neutral-100 pb-4">Our Farm Partners</h1>
      <p className="leading-relaxed">
        Quickcart is nothing without our incredible network of dedicated farmers. We selectively partner with local, family-owned farms that share our values of sustainable agriculture, fair labor practices, and uncompromising quality.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm">
          <h3 className="font-outfit font-bold text-xl text-neutral-800 mb-2">Green Acres Organic</h3>
          <p className="text-sm">Located in the heart of the valley, Green Acres supplies our premium leafy greens and heirloom tomatoes. They have been certified organic for over 15 years.</p>
        </div>
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm">
          <h3 className="font-outfit font-bold text-xl text-neutral-800 mb-2">Sunny Side Dairy</h3>
          <p className="text-sm">Providing pasture-raised dairy products and eggs. Sunny Side ensures all animals have open access to grazing, resulting in superior quality products.</p>
        </div>
      </div>
    </div>
  );
}
