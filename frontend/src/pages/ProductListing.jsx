import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, SlidersHorizontal, Info, Star } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const defaultCategoriesList = [
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

export default function ProductListing() {
  const [categoriesList, setCategoriesList] = useState(defaultCategoriesList);
  const [searchParams, setSearchParams] = useSearchParams();
  const [rawProducts, setRawProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedRating, setSelectedRating] = useState(0);

  const sliderRef = useRef(null);
  
  const categoryParam = searchParams.get('category') || 'All';
  const searchParam = searchParams.get('search') || '';
  const tagParam = searchParams.get('tag') || '';

  // Fetch categories from DB
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesAPI.getAll();
        if (data && data.length > 0) {
          setCategoriesList(data);
        }
      } catch (err) {
        console.error('Error fetching categories from API, using defaults', err);
      }
    };
    fetchCategories();
  }, []);

  // 1. Fetch raw products when query params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productsAPI.getAll(categoryParam, searchParam);
        let filtered = data;
        if (tagParam) {
          filtered = data.filter(p => p.tags.includes(tagParam));
        }
        setRawProducts(filtered);
      } catch (error) {
        console.error('Error loading products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryParam, searchParam, tagParam]);

  // 2. Perform instant local filtering when rating or price changes
  useEffect(() => {
    let filtered = [...rawProducts];
    if (selectedRating > 0) {
      filtered = filtered.filter(p => p.rating >= selectedRating);
    }
    filtered = filtered.filter(p => p.price <= maxPrice);
    setProducts(filtered);
  }, [rawProducts, selectedRating, maxPrice]);

  const handleCategorySelect = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const scrollSlider = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const ratingsOptions = [4.5, 4.0, 3.5];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-neutral-600">Shop</span>
        {categoryParam !== 'All' && (
          <>
            <ChevronRight size={12} />
            <span className="text-primary capitalize">{categoryParam}</span>
          </>
        )}
      </nav>

      {/* Horizontal Category Slider */}
      <div className="relative mb-8 bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4 border-b border-neutral-50 pb-2">
          <h3 className="font-outfit font-extrabold text-neutral-800 text-sm">Shop by Category</h3>
          <button 
            onClick={scrollSlider}
            className="p-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 rounded-full transition-colors flex items-center justify-center border border-neutral-100 shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div 
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-none snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* All category button */}
          <button
            onClick={() => handleCategorySelect('All')}
            className="flex flex-col items-center gap-2 text-center flex-shrink-0 snap-start select-none group focus:outline-none"
          >
            <div className={`w-20 h-20 bg-neutral-50 border rounded-2xl p-1 flex items-center justify-center transition-all duration-300 ${
              categoryParam === 'All' 
                ? 'border-primary ring-2 ring-primary-light bg-primary-light/10 shadow-md' 
                : 'border-neutral-100 hover:border-primary/25 hover:shadow-sm'
            }`}>
              <div className="w-full h-full bg-neutral-200/50 flex items-center justify-center rounded-xl font-bold text-xs text-neutral-500">
                All
              </div>
            </div>
            <span className={`font-outfit font-bold text-[10px] sm:text-xs max-w-[84px] leading-tight ${
              categoryParam === 'All' ? 'text-primary' : 'text-neutral-600 group-hover:text-neutral-800'
            }`}>
              All Items
            </span>
          </button>

          {categoriesList.map((cat) => {
            const isSelected = categoryParam === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.name)}
                className="flex flex-col items-center gap-2 text-center flex-shrink-0 snap-start select-none group focus:outline-none"
              >
                <div className={`w-20 h-20 bg-neutral-50 border rounded-2xl p-1 flex items-center justify-center transition-all duration-300 ${
                  isSelected 
                    ? 'border-primary ring-2 ring-primary-light bg-primary-light/10 shadow-md' 
                    : 'border-neutral-100 hover:border-primary/25 hover:shadow-sm'
                }`}>
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <span className={`font-outfit font-bold text-[10px] sm:text-xs max-w-[84px] leading-tight ${
                  isSelected ? 'text-primary' : 'text-neutral-600 group-hover:text-neutral-800'
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-6 text-left">
          
          {/* Category selection list */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 font-outfit font-bold text-neutral-800 text-sm border-b border-neutral-50 pb-2">
              <SlidersHorizontal size={16} className="text-primary" />
              <span>Departments</span>
            </div>

            <ul className="space-y-0.5 max-h-60 overflow-y-auto pr-1">
              <li>
                <button
                  onClick={() => handleCategorySelect('All')}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    categoryParam === 'All'
                      ? 'bg-primary-light text-primary'
                      : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  All Categories
                </button>
              </li>
              {categoriesList.map((cat) => (
                <li key={cat.name}>
                  <button
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      categoryParam === cat.name
                        ? 'bg-primary-light text-primary'
                        : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price Range Slider */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="font-outfit font-bold text-neutral-800 text-sm border-b border-neutral-50 pb-2">
              Price Range
            </div>
            
            <div className="space-y-3 pt-1">
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-500">
                <span>Min: $0.00</span>
                <span className="text-primary font-bold">Max: ₹{maxPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Ratings list */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="font-outfit font-bold text-neutral-800 text-sm border-b border-neutral-50 pb-2">
              Customer Rating
            </div>

            <ul className="space-y-2">
              {ratingsOptions.map((rating) => {
                const isChecked = selectedRating === rating;
                return (
                  <li key={rating}>
                    <button
                      onClick={() => setSelectedRating(isChecked ? 0 : rating)}
                      className={`w-full flex items-center justify-between px-3 py-2 border rounded-xl text-xs font-bold transition-all ${
                        isChecked 
                          ? 'border-primary bg-primary-light/20 text-primary' 
                          : 'border-neutral-100 text-neutral-500 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-secondary flex">
                          <Star size={12} fill="currentColor" />
                        </span>
                        <span>{rating} & above</span>
                      </div>
                      {isChecked && <span className="text-[10px] text-primary">Active</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Coupon Promo card */}
          <div className="bg-gradient-to-br from-primary-dark to-primary-darker rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full"></div>
            <span className="bg-white/10 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase">
              Special Coupon
            </span>
            <h4 className="font-outfit font-extrabold text-base mt-2">Get 20% Off!</h4>
            <p className="text-xs text-primary-light mt-1">Use promo code FRESH20 on your next basket checkout.</p>
          </div>
        </aside>

        {/* Main Content Grid */}
        <main className="flex-grow space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
            <div className="text-left">
              <h1 className="font-outfit font-extrabold text-xl text-neutral-800">
                {categoryParam === 'All' ? 'All Groceries' : categoryParam}
              </h1>
              <p className="text-xs text-neutral-400 mt-0.5">
                Showing {products.length} fresh items {searchParam && `matching "${searchParam}"`}
              </p>
            </div>
            
            {/* Search within results */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchParam}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  if (e.target.value) {
                    newParams.set('search', e.target.value);
                  } else {
                    newParams.delete('search');
                  }
                  setSearchParams(newParams);
                }}
                placeholder="Filter results..."
                className="w-full pl-3 pr-9 py-2 bg-neutral-50 text-xs text-neutral-800 rounded-lg border border-neutral-100 outline-none focus:bg-white focus:border-primary/20 transition-all"
              />
              <Search size={14} className="absolute right-3 top-2.5 text-neutral-400" />
            </div>
          </div>

          {/* Grid Render */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-neutral-100 rounded-2xl"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-neutral-100 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center gap-3">
              <div className="p-4 bg-neutral-50 text-neutral-400 rounded-full">
                <Info size={36} />
              </div>
              <h3 className="font-outfit font-bold text-neutral-800 text-lg">No Products Found</h3>
              <p className="text-sm text-neutral-500 max-w-sm">
                We couldn't find any fresh groceries matching your criteria. Try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchParams({});
                  setMaxPrice(1000);
                  setSelectedRating(0);
                }}
                className="mt-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
