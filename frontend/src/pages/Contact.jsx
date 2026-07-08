import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8 fade-in text-left text-neutral-600 space-y-6">
      <h1 className="font-outfit font-extrabold text-4xl text-neutral-800 mb-8 border-b border-neutral-100 pb-4">Contact Us</h1>
      
      <p className="leading-relaxed mb-8">
        We're here to help! If you have any questions, concerns, or feedback, please reach out to our customer care team through any of the channels below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone size={24} />
          </div>
          <h3 className="font-outfit font-bold text-lg text-neutral-800 mb-1">Phone</h3>
          <p className="text-sm">+1 (800) 123-4567</p>
          <p className="text-xs text-neutral-400 mt-2">Mon-Fri, 9am - 6pm</p>
        </div>
        
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={24} />
          </div>
          <h3 className="font-outfit font-bold text-lg text-neutral-800 mb-1">Email</h3>
          <p className="text-sm">support@quickcart.com</p>
          <p className="text-xs text-neutral-400 mt-2">Expect a reply within 24 hours</p>
        </div>
        
        <div className="bg-white border border-neutral-100 p-6 rounded-2xl shadow-sm text-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={24} />
          </div>
          <h3 className="font-outfit font-bold text-lg text-neutral-800 mb-1">Office</h3>
          <p className="text-sm">123 Fresh Lane<br />San Francisco, CA 94110</p>
        </div>
      </div>
    </div>
  );
}
