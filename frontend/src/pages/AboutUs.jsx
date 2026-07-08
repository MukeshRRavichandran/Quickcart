import React from 'react';
import { Heart, ShieldCheck, Leaf, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="bg-white fade-in">
      {/* Hero Section */}
      <section className="relative bg-primary py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C20,0 50,100 100,0 L100,100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 tracking-tight">
            Freshness You Can Trust
          </h1>
          <p className="text-primary-light text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            We're on a mission to bring farm-fresh, organic, and sustainably sourced produce directly to your table, bridging the gap between local farmers and conscious consumers.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 text-left">
              <span className="text-secondary font-bold text-sm tracking-wider uppercase">Our Story</span>
              <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-neutral-800 leading-tight">
                Rooted in Quality,<br />Grown with Care
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                Founded with a simple belief that everyone deserves access to healthy, unadulterated food, Quickcart started as a small local initiative connecting a few farmers with the community. Today, we've grown into a comprehensive platform that ensures the freshest produce reaches you within hours of being harvested.
              </p>
              <p className="text-neutral-600 leading-relaxed">
                We eliminate the middleman, ensuring farmers get a fair price for their hard work while you get the best quality ingredients for your family's meals. Our cold-chain delivery guarantees that the nutritional value and freshness remain intact from the farm to your doorstep.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-8">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80" alt="Fresh Produce" className="w-full h-64 object-cover rounded-3xl shadow-lg" />
                <img src="https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=500&auto=format&fit=crop&q=80" alt="Farmers" className="w-full h-48 object-cover rounded-3xl shadow-lg" />
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80" alt="Healthy Food" className="w-full h-48 object-cover rounded-3xl shadow-lg" />
                <img src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=500&auto=format&fit=crop&q=80" alt="Delivery" className="w-full h-64 object-cover rounded-3xl shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-bold text-sm tracking-wider uppercase mb-2 block">Our Values</span>
            <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-neutral-800">
              What Drives Us Every Day
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf size={32} />
              </div>
              <h3 className="font-outfit font-bold text-xl text-neutral-800 mb-3">100% Organic</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                We strictly partner with certified organic farms, ensuring no harmful pesticides touch your food.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="font-outfit font-bold text-xl text-neutral-800 mb-3">Quality Assured</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Every item goes through a rigorous quality check before it gets packed for delivery.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart size={32} />
              </div>
              <h3 className="font-outfit font-bold text-xl text-neutral-800 mb-3">Sustainably Sourced</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                We prioritize eco-friendly packaging and ethical farming practices to protect our planet.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100 hover:shadow-md transition-shadow text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="font-outfit font-bold text-xl text-neutral-800 mb-3">Community First</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                We support local communities by ensuring fair trade practices for all our farming partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-primary rounded-3xl p-12 sm:p-16 relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <h2 className="font-outfit font-extrabold text-3xl sm:text-4xl text-white mb-6 relative z-10">
            Ready to experience the difference?
          </h2>
          <p className="text-primary-light text-lg mb-8 relative z-10 max-w-2xl mx-auto">
            Join thousands of happy customers who have transformed their eating habits with our fresh, organic deliveries.
          </p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 relative z-10">
            Start Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
