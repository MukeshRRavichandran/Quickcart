import React from 'react';

export default function Sustainability() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 fade-in text-left text-neutral-600 space-y-6">
      <h1 className="font-outfit font-extrabold text-4xl text-neutral-800 mb-8 border-b border-neutral-100 pb-4">Our Commitment to Sustainability</h1>
      <p className="leading-relaxed">
        At Quickcart, sustainability is not just a buzzword; it's baked into our core philosophy. We believe that healthy food should not come at the expense of our planet. Our sustainability initiatives span across our entire supply chain.
      </p>
      
      <h2 className="font-outfit font-bold text-2xl text-neutral-800 mt-8 mb-4">1. Eco-Friendly Packaging</h2>
      <p className="leading-relaxed">
        We are actively phasing out single-use plastics. Over 80% of our orders are now delivered in compostable, recyclable, or reusable packaging. We use corrugated cardboard boxes made from post-consumer recycled content and bio-based cooling elements.
      </p>

      <h2 className="font-outfit font-bold text-2xl text-neutral-800 mt-8 mb-4">2. Carbon-Neutral Delivery</h2>
      <p className="leading-relaxed">
        We're transitioning our delivery fleet to electric vehicles. For every mile driven by our legacy fleet, we invest in carbon offset programs that support reforestation and renewable energy projects. 
      </p>

      <h2 className="font-outfit font-bold text-2xl text-neutral-800 mt-8 mb-4">3. Zero Food Waste</h2>
      <p className="leading-relaxed">
        Food waste is a major contributor to greenhouse gas emissions. We utilize advanced inventory algorithms to predict demand, reducing overstock. Produce that doesn't meet our visual standards but is perfectly healthy is donated to local food banks or sent to composting facilities.
      </p>
    </div>
  );
}
