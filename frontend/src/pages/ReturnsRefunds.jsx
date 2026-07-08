import React from 'react';

export default function ReturnsRefunds() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 fade-in text-left text-neutral-600 space-y-6">
      <h1 className="font-outfit font-extrabold text-4xl text-neutral-800 mb-8 border-b border-neutral-100 pb-4">Returns & Refunds</h1>
      
      <p className="leading-relaxed font-semibold">
        Your satisfaction is our priority. Due to the perishable nature of our products, we do not accept physical returns.
      </p>

      <h2 className="font-outfit font-bold text-xl text-neutral-800 mt-8 mb-2">Quality Guarantee</h2>
      <p className="leading-relaxed">
        If you receive an item that is damaged, spoiled, or otherwise below our quality standards, please contact our customer support team within 24 hours of delivery. 
      </p>

      <h2 className="font-outfit font-bold text-xl text-neutral-800 mt-8 mb-2">Refund Process</h2>
      <p className="leading-relaxed">
        To request a refund, navigate to your order history and select the issue with the specific item, or contact us directly with a photo of the product. We will issue a refund or store credit for the affected item within 3-5 business days.
      </p>
    </div>
  );
}
