import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-neutral-50 px-4">
      <div className="bg-white border border-neutral-100 rounded-3xl p-12 text-center max-w-md w-full shadow-lg space-y-5">
        <div className="p-4 bg-primary-light text-primary rounded-full inline-block">
          <ShieldAlert size={48} />
        </div>
        
        <div className="space-y-1 text-center">
          <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">Resources Not Found</h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-semibold leading-relaxed">
            The operational section you are searching for is restricted or does not exist in the Quickcart Admin Console.
          </p>
        </div>

        <Link
          to="/admin/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-md shadow-primary/10 transition-colors w-full"
        >
          <ArrowLeft size={16} />
          <span>Back to Control Deck</span>
        </Link>
      </div>
    </div>
  );
}
