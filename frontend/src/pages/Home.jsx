import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Truck, ShieldCheck, RefreshCw, Mail, Headset, CreditCard, ChevronLeft, ChevronRight, Apple, Leaf } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { productsAPI, couponsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('BEST SELLERS');
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);

  useGSAP(() => {
    // Hero Elements
    gsap.fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });

    // Word by word reveal
    gsap.fromTo(".hero-word", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" });

    gsap.fromTo(".hero-desc", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: "power3.out" });
    gsap.fromTo(".hero-cta", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, delay: 0.6, ease: "back.out(1.7)", stagger: 0.1 });

    // Background Ken Burns
    gsap.to(".hero-bg-img", { scale: 1.05, duration: 8, ease: "sine.inOut", repeat: -1, yoyo: true });

    // Floating elements
    gsap.to(".float-1", { y: -20, rotation: 10, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".float-2", { y: 25, rotation: -15, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(".float-3", { x: 15, y: -15, rotation: 20, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // ScrollTriggers
    gsap.utils.toArray(".scroll-section").forEach(section => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });
  }, { scope: containerRef });

  const heroSlides = [
    {
      image: "https://i.pinimg.com/1200x/83/35/b5/8335b51ac60872f87269bd5682ca9c53.jpg",
      badge: "Freshness Delivered Daily",
      titleStart: "Fresh Food,",
      titleHighlight: "Delivered Fast",
      description: "From farm to table in 30 minutes. Sourced responsibly from our local fields straight to your kitchen.",
    },
    {
      image: "https://i.pinimg.com/1200x/91/c0/c8/91c0c8d368f5c376c550d3ee6cea8188.jpg",
      badge: "Organic Choices",
      titleStart: "Healthy Living,",
      titleHighlight: "Made Easy",
      description: "Explore our wide range of organic, pesticide-free vegetables and fruits for a healthier lifestyle.",
    }
  ];



  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, coupData] = await Promise.all([
          productsAPI.getAll(),
          couponsAPI.getActive()
        ]);
        setProducts(prodData);
        setCoupons(coupData);
      } catch (error) {
        console.error('Error loading data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  // Filters
  const popularPicks = products.filter(p => p.originalPrice > p.price).slice(0, 6);

  const getFeaturedProducts = () => {
    if (selectedTab === 'BEST SELLERS') {
      return products.filter(p => p.tags.includes('Bestseller')).slice(0, 6);
    }
    if (selectedTab === 'NEW ARRIVALS') {
      return products.filter(p => p.tags.includes('Fresh Pick') || p.category === 'Bakery').slice(0, 6);
    }
    if (selectedTab === 'ORGANIC ONLY') {
      return products.filter(p => p.tags.includes('Organic')).slice(0, 6);
    }
    return products.slice(0, 6);
  };

  const categories = [
    {
      name: 'Fruits & Vegetables',
      image: 'https://i.pinimg.com/736x/52/df/27/52df270aa6617ff23841fcf1a0b6584d.jpg',
    },
    {
      name: 'Dairy & Eggs',
      image: 'https://i.pinimg.com/736x/96/87/22/968722112f5f58025f5feae9df702a71.jpg',
    },
    {
      name: 'Rice, Atta & Grains',
      image: 'https://i.pinimg.com/1200x/4b/0f/dd/4b0fdddda16cb10c5a3a567703d508fa.jpg',
    },
    {
      name: 'Spices, Oils & Cooking Essentials',
      image: 'https://i.pinimg.com/1200x/51/94/7d/51947db7a9e4faa5764de43a6da9a634.jpg',
    },
    {
      name: 'Bakery',
      image: 'https://i.pinimg.com/736x/5f/da/63/5fda63032f233de7fc99a970eac1c0c7.jpg',
    },
    {
      name: 'Snacks & Biscuits',
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=200&auto=format&fit=crop&q=80',
    },
    {
      name: 'Beverages',
      image: 'https://i.pinimg.com/1200x/8d/1e/b0/8d1eb0e0ccbe6a055d1076bfcb317464.jpg',
    },
    {
      name: 'Meat, Fish & Seafood',
      image: 'https://i.pinimg.com/736x/25/36/a5/2536a53ee64eaa4da8699936863897f3.jpg',
    },
    {
      name: 'Sweets, Chocolates & Desserts',
      image: 'https://i.pinimg.com/1200x/c5/50/37/c550377d2f5f3fff665ae24c2455487b.jpg',
    },
  ];

  return (
    <div ref={containerRef} className="space-y-6">



      {/* Hero Section - Broken out of container to be full width */}
      <section className="hero-section relative overflow-hidden w-[100vw] left-[50%] -translate-x-[50%] pt-16 pb-20 md:py-28 px-6 lg:px-16 mt-0 flex items-center justify-start min-h-[500px] group">

        {/* Animated Background Scene */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full -z-10 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.titleStart}
              className="w-full h-full object-cover object-center hero-bg-img origin-center"
            />
          </div>
        ))}

        {/* Content (Overlayed) */}
        <div className="max-w-xl space-y-6 text-left relative z-10 transition-all duration-500 transform translate-y-0">
          <span className="hero-badge text-primary font-bold text-xs uppercase tracking-widest bg-primary-light/50 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
            {heroSlides[currentSlide].badge}
          </span>
          <h1 className="hero-title font-outfit font-extrabold text-4xl sm:text-5xl lg:text-6xl text-neutral-800 leading-tight">
            {heroSlides[currentSlide].titleStart} <br />
            <span className="text-primary">{heroSlides[currentSlide].titleHighlight}</span>
          </h1>
          <p className="hero-desc text-neutral-700 text-base sm:text-lg leading-relaxed font-medium max-w-md bg-white/40 p-2 rounded-lg backdrop-blur-sm">
            {heroSlides[currentSlide].description}
          </p>

          <div className="flex gap-3 pt-2">
            <Link
              to="/shop"
              className="hero-cta px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg flex items-center justify-center gap-2 inline-flex"
            >
              Order Now <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => document.getElementById('categories-section').scrollIntoView({ behavior: 'smooth' })}
              className="hero-cta px-8 py-3.5 bg-white hover:bg-neutral-50 text-neutral-800 font-bold rounded-xl text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 inline-flex"
            >
              Categories
            </button>
          </div>
        </div>

        {/* Floating Decor */}
        <div className="absolute right-[10%] top-[20%] float-1 text-4xl hidden lg:block opacity-80 filter drop-shadow-md">🥬</div>
        <div className="absolute right-[25%] bottom-[15%] float-2 text-5xl hidden md:block opacity-90 filter drop-shadow-md">🥕</div>
        <div className="absolute left-[50%] top-[10%] float-3 text-3xl hidden md:block opacity-70 filter drop-shadow-md">🍎</div>

        {/* Slider Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
        >
          <ChevronRight size={20} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-primary w-6' : 'bg-neutral-300 hover:bg-neutral-400'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="scroll-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Banner 1: Healthy Fruits */}
          <div className="bg-white rounded-lg overflow-hidden flex items-center justify-between p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="z-10 w-1/2">
              <h3 className="font-outfit font-extrabold text-xl text-neutral-800 mb-1">Healthy Fruits</h3>
              <p className="text-sm text-neutral-700 font-medium mb-4">Save Up to 20% Off</p>
              <Link to="/shop?category=Fruits%20%26%20Vegetables" className="inline-block px-4 py-2 bg-[#7cb342] hover:bg-[#689f38] text-white text-xs font-bold rounded transition-colors">SHOP NOW</Link>
            </div>
            <div className="w-1/2 flex justify-end">
              <img src="https://i.pinimg.com/736x/52/df/27/52df270aa6617ff23841fcf1a0b6584d.jpg" alt="Fruits" className="h-32 object-contain drop-shadow-md rounded-full mix-blend-multiply" />
            </div>
          </div>

          {/* Banner 2: Fresh Vegetables */}
          <div className="bg-white rounded-lg overflow-hidden flex items-center justify-between p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="z-10 w-1/2">
              <h3 className="font-outfit font-extrabold text-xl text-neutral-800 mb-1">Fresh Vegetables</h3>
              <p className="text-sm text-neutral-700 font-medium mb-4">Save Up to 20% Off</p>
              <Link to="/shop?category=Fruits%20%26%20Vegetables" className="inline-block px-4 py-2 bg-[#7cb342] hover:bg-[#689f38] text-white text-xs font-bold rounded transition-colors">SHOP NOW</Link>
            </div>
            <div className="w-1/2 flex justify-end">
              <img src="https://i.pinimg.com/736x/b3/37/2d/b3372d4bd8515bfeb7cfe8fc203fed74.jpg" alt="Vegetables" className="h-32 object-contain drop-shadow-md rounded-full mix-blend-multiply" />
            </div>
          </div>

          {/* Banner 3: Nuts & Seeds */}
          <div className="bg-white rounded-lg overflow-hidden flex items-center justify-between p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="z-10 w-1/2">
              <h3 className="font-outfit font-extrabold text-xl text-neutral-800 mb-1">Nuts & Seeds</h3>
              <p className="text-sm text-neutral-700 font-medium mb-4">Save Up to 20% Off</p>
              <Link to="/shop?category=Snacks%20%26%20Biscuits" className="inline-block px-4 py-2 bg-[#7cb342] hover:bg-[#689f38] text-white text-xs font-bold rounded transition-colors">SHOP NOW</Link>
            </div>
            <div className="w-1/2 flex justify-end">
              <img src="https://i.pinimg.com/1200x/1e/1c/e0/1e1ce0832100a122e94cb663a312058c.jpg" alt="Nuts & Seeds" className="h-32 object-contain drop-shadow-md rounded-full mix-blend-multiply" />
            </div>
          </div>

        </div>
      </section>

      {/* Special Offers (Coupons) */}
      <section className="scroll-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-outfit font-extrabold text-xl text-neutral-800">Special Offers</h3>
          </div>
          {coupons.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => (
                <div key={coupon._id} className="bg-white border border-primary/20 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-200 to-green-50 rounded-bl-full group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-3 uppercase tracking-wider">{coupon.code}</span>
                    <h4 className="font-outfit font-extrabold text-lg text-neutral-800">{coupon.name}</h4>
                    <p className="text-sm text-neutral-600 font-medium mt-1">
                      {coupon.type === 'Percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                      {coupon.minOrderValue > 0 && ` on orders above ₹${coupon.minOrderValue}`}
                    </p>
                  </div>
                  <div className="mt-5 text-xs text-neutral-500 font-semibold border-t border-primary/10 pt-3 flex justify-between items-center">
                    <span>Limit: {coupon.userLimit} per user</span>
                    <span className="text-primary font-bold">Use at Checkout</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm font-medium">No active coupons right now. Check back later!</p>
          )}
        </div>
      </section>

      {/* Popular Picks & Deals */}
      <section className="scroll-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
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
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-neutral-100 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {popularPicks.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Explore by Category */}
      <section id="categories-section" className="scroll-section py-12">
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
      <section className="scroll-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-neutral-100 pb-4">
          <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">
            Featured Groceries
          </h2>
          <div className="flex bg-neutral-100 p-1 rounded-full text-xs font-bold text-neutral-500">
            {['BEST SELLERS', 'NEW ARRIVALS', 'ORGANIC ONLY'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${selectedTab === tab
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
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-neutral-100 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {getFeaturedProducts().map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Stay Fresh Newsletter Banner */}
      <section className="scroll-section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-3xl px-6 py-12 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl shadow-primary/15">
          <div className="text-left max-w-lg space-y-2 text-white">
            <h2 className="font-outfit font-extrabold text-2xl sm:text-3xl leading-tight">
              Stay Fresh with Our Updates
            </h2>
            <p className="text-xs sm:text-sm text-primary-light leading-relaxed">
              Subscribe to get exclusive weekly deals, recipe ideas, and ₹10 off your first order!
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
