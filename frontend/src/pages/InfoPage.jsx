import React from 'react';

const pagesData = {
  about: { title: 'About Us', content: 'Quickcart is your premier destination for farm-fresh, organic goodness. We believe that everyone deserves access to high-quality, sun-baked ingredients.' },
  sustainability: { title: 'Sustainability', content: 'We are committed to zero waste and sustainable farming practices. All our packaging is 100% recyclable or compostable.' },
  'farm-partners': { title: 'Farm Partners', content: 'We work closely with local farms and independent growers to bring you the freshest produce while supporting our local agricultural community.' },
  'gift-cards': { title: 'Gift Cards', content: 'Give the gift of fresh, organic food! Quickcart Gift Cards are perfect for any occasion and never expire.' },
  shipping: { title: 'Shipping Policy', content: 'We offer rapid cold-chain delivery within 30 minutes in select areas. Your groceries arrive fresh, crisp, and perfectly chilled.' },
  returns: { title: 'Returns & Refunds', content: 'Our "No Questions Asked" policy guarantees you a full refund if you are not completely satisfied with the quality of your fresh produce.' },
  privacy: { title: 'Privacy Policy', content: 'Your privacy is important to us. We securely encrypt all payments and never sell your personal data to third parties.' },
  contact: { title: 'Contact Us', content: 'Have a question? Reach out to our 24/7 dedicated support team at support@quickcart.com or call us directly.' }
};

export default function InfoPage({ pageKey }) {
  const data = pagesData[pageKey] || { title: 'Information', content: 'Coming soon...' };
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 fade-in">
      <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 border border-neutral-100">
        <h1 className="text-3xl md:text-4xl font-outfit font-extrabold text-neutral-800 mb-6">
          {data.title}
        </h1>
        <div className="prose max-w-none text-neutral-600 leading-relaxed text-lg">
          <p className="font-medium text-neutral-800">{data.content}</p>
          <div className="mt-8 space-y-4">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit 
              arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. 
              Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
            </p>
            <p>
              Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, 
              ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue 
              lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
