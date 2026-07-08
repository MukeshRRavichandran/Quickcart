import React from 'react';

export default function GiftCards() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 fade-in text-left text-neutral-600 space-y-6">
      <h1 className="font-outfit font-extrabold text-4xl text-neutral-800 mb-8 border-b border-neutral-100 pb-4">Gift Cards</h1>
      <p className="leading-relaxed">
        Give the gift of fresh, organic food! Quickcart gift cards are the perfect way to show you care. Available in various denominations, they never expire and can be used on any product across our store.
      </p>
      
      <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl mt-8 text-center">
        <h2 className="font-outfit font-bold text-2xl text-primary-dark mb-4">Coming Soon</h2>
        <p className="text-primary-dark/80">
          Digital gift cards are currently undergoing an upgrade. Check back soon to purchase!
        </p>
      </div>
    </div>
  );
}
