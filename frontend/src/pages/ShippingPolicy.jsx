import React from 'react';

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 fade-in text-left text-neutral-600 space-y-6">
      <h1 className="font-outfit font-extrabold text-4xl text-neutral-800 mb-8 border-b border-neutral-100 pb-4">Shipping Policy</h1>
      
      <h2 className="font-outfit font-bold text-xl text-neutral-800 mt-8 mb-2">Delivery Zones</h2>
      <p className="leading-relaxed">
        We currently deliver to the greater metropolitan area and surrounding suburbs. If you are unsure whether we deliver to your zip code, please enter it at checkout.
      </p>

      <h2 className="font-outfit font-bold text-xl text-neutral-800 mt-8 mb-2">Delivery Times</h2>
      <p className="leading-relaxed">
        Orders placed before 2:00 PM are eligible for next-day delivery. Our delivery windows are between 8:00 AM and 8:00 PM. You will receive a tracking link via SMS once your driver is en route.
      </p>

      <h2 className="font-outfit font-bold text-xl text-neutral-800 mt-8 mb-2">Cold-Chain Guarantee</h2>
      <p className="leading-relaxed">
        All our delivery vehicles are temperature-controlled. Your fresh produce, dairy, and meat products are guaranteed to arrive at the optimal temperature to preserve freshness and safety.
      </p>
      
      <h2 className="font-outfit font-bold text-xl text-neutral-800 mt-8 mb-2">Shipping Fees</h2>
      <p className="leading-relaxed">
        Standard delivery is ₹49. Orders over ₹500 qualify for free shipping. Delivery fees are non-refundable.
      </p>
    </div>
  );
}
