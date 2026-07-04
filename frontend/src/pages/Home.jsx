import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, RefreshCw, Mail } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('BEST SELLERS');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  // Filters
  const popularPicks = products.filter(p => p.originalPrice > p.price).slice(0, 4);
  
  const getFeaturedProducts = () => {
    if (selectedTab === 'BEST SELLERS') {
      return products.filter(p => p.tags.includes('Bestseller')).slice(0, 4);
    }
    if (selectedTab === 'NEW ARRIVALS') {
      return products.filter(p => p.tags.includes('Fresh Pick') || p.category === 'Bakery').slice(0, 4);
    }
    if (selectedTab === 'ORGANIC ONLY') {
      return products.filter(p => p.tags.includes('Organic')).slice(0, 4);
    }
    return products.slice(0, 4);
  };

  const categories = [
    {
      name: 'Fruits & Vegetables',
      image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dairy & Eggs',
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Rice, Atta & Grains',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Spices, Oils & Cooking Essentials',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Bakery',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Snacks & Biscuits',
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Beverages',
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Instant, Ready-to-Cook & Ready-to-Eat',
      image: 'https://images.unsplash.com/photo-1626200419199-391ae4cd7a41?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Meat, Fish & Seafood',
      image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sweets, Chocolates & Desserts',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-6 fade-in">
      


      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl max-w-7xl mx-auto px-6 py-16 md:py-28 lg:px-16 mt-2 flex items-center justify-start min-h-[480px]">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full -z-10">
          <img
            src="https://i.pinimg.com/736x/13/4d/7f/134d7fb5a1c8a9a91d30f42e02671b12.jpg"
            alt="Fresh Organic Vegetables Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content (Overlayed) */}
        <div className="max-w-xl space-y-6 text-left relative z-10">
          <span className="text-primary font-bold text-xs uppercase tracking-widest bg-primary-light px-3 py-1 rounded-full inline-block">
            Freshness Delivered Daily
          </span>
          <h1 className="font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-neutral-800 leading-tight">
            Fresh Food, <br />
            <span className="text-primary">Delivered Fast</span>
          </h1>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed font-semibold">
            From farm to table in 30 minutes. Sourced responsibly from our local fields straight to your kitchen.
          </p>

          <div className="flex gap-3">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md shadow-primary/10 hover:shadow-lg flex items-center justify-center gap-2 inline-flex"
            >
              Order Now
            </Link>
          </div>

        </div>
      </section>

      {/* Core Value Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 p-5 bg-white border border-neutral-100 rounded-2xl hover:shadow-md transition-shadow">
          <div className="p-3 bg-primary-light text-primary rounded-xl">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="font-outfit font-bold text-neutral-800 text-sm">Free Delivery</h4>
            <p className="text-xs text-neutral-400">On orders over $50</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-5 bg-white border border-neutral-100 rounded-2xl hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-outfit font-bold text-neutral-800 text-sm">Fresh Guarantee</h4>
            <p className="text-xs text-neutral-400">100% money back guarantee</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-5 bg-white border border-neutral-100 rounded-2xl hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <RefreshCw size={24} />
          </div>
          <div>
            <h4 className="font-outfit font-bold text-neutral-800 text-sm">Easy Returns</h4>
            <p className="text-xs text-neutral-400">Hassle-free 24h pickup</p>
          </div>
        </div>
      </section>

      {/* Popular Picks & Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end border-b border-neutral-100 pb-4">
          <div>
            <span className="text-primary font-bold text-[10px] uppercase tracking-wider block mb-1">
              Seasonal Favorites
            </span>
            <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">
              Popular Picks & Deals
            </h2>
          </div>
          <Link
            to="/shop?tag=Bestseller"
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
          >
            View All Deals <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-neutral-100 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {popularPicks.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Explore by Category */}
      <section className="bg-neutral-100/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">
              Explore by Category
            </h2>
            <p className="text-xs text-neutral-400 mt-1">Browse fresh groceries by departments</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-3 text-center"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center p-1 group-hover:border-primary/40 group-hover:shadow-md transition-all duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <span className="font-outfit font-bold text-xs sm:text-sm text-neutral-700 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Groceries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-neutral-100 pb-4">
          <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">
            Featured Groceries
          </h2>
          <div className="flex bg-neutral-100 p-1 rounded-full text-xs font-bold text-neutral-500">
            {['BEST SELLERS', 'NEW ARRIVALS', 'ORGANIC ONLY'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedTab === tab
                    ? 'bg-primary text-white shadow-sm shadow-primary/10'
                    : 'hover:text-neutral-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-neutral-100 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {getFeaturedProducts().map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Stay Fresh Newsletter Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-3xl px-6 py-12 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl shadow-primary/15">
          <div className="text-left max-w-lg space-y-2 text-white">
            <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl leading-tight">
              Stay Fresh with Our Updates
            </h2>
            <p className="text-xs sm:text-sm text-primary-light leading-relaxed">
              Subscribe to get exclusive weekly deals, recipe ideas, and $10 off your first order!
            </p>
          </div>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Successfully subscribed to Quickcart notifications!');
            }}
            className="flex w-full md:w-auto flex-col sm:flex-row gap-3 flex-shrink-0"
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="px-5 py-3.5 bg-white text-sm text-neutral-800 rounded-xl outline-none focus:ring-2 focus:ring-white/20 transition-all w-full md:w-72"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-sm transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Subscribe Now
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
