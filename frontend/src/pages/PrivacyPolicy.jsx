import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 fade-in text-left text-neutral-600 space-y-6">
      <h1 className="font-outfit font-extrabold text-4xl text-neutral-800 mb-8 border-b border-neutral-100 pb-4">Privacy Policy</h1>
      
      <p className="leading-relaxed">
        Quickcart is committed to protecting your privacy and ensuring your personal information is handled securely and responsibly.
      </p>

      <h2 className="font-outfit font-bold text-xl text-neutral-800 mt-8 mb-2">Information We Collect</h2>
      <p className="leading-relaxed">
        We collect information you provide directly to us, such as your name, email address, delivery address, phone number, and payment information when you place an order or create an account.
      </p>

      <h2 className="font-outfit font-bold text-xl text-neutral-800 mt-8 mb-2">How We Use Your Information</h2>
      <p className="leading-relaxed">
        We use this information to fulfill your orders, communicate with you about your deliveries, and, if you opt-in, send you promotional offers and newsletters. We do not sell your personal data to third parties.
      </p>

      <h2 className="font-outfit font-bold text-xl text-neutral-800 mt-8 mb-2">Data Security</h2>
      <p className="leading-relaxed">
        We implement a variety of security measures to maintain the safety of your personal information. All payment transactions are encrypted and processed through a secure gateway provider.
      </p>
    </div>
  );
}
