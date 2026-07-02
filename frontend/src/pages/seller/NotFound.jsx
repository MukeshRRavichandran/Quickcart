import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-neutral-50 px-4">
      <div className="bg-white border border-neutral-100 rounded-3xl p-12 text-center max-w-md w-full shadow-lg space-y-5">
        <div className="p-4 bg-primary-light text-primary rounded-full inline-block">
          <HelpCircle size={48} />
        </div>
        
        <div className="space-y-1">
          <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">Page Not Found</h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-semibold leading-relaxed">
            The page you are looking for does not exist in the Seller Portal.
          </p>
        </div>

        <Link
          to="/seller/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-md shadow-primary/10 transition-colors w-full"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
