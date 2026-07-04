import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, X, ShoppingCart, Info, Share2, Sparkles, Star, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../services/api';

export default function Wishlist() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const data = await productsAPI.getAll();
        // filter out items in wishlist
        const wishlistIds = wishlistItems.map(item => item._id);
        const filtered = data.filter(p => !wishlistIds.includes(p._id));
        setRecommendations(filtered.slice(0, 2));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRecs(false);
      }
    };
    fetchRecs();
  }, [wishlistItems]);

  const handleQuickAdd = async (productId) => {
    try {
      await addToCart(productId, 1);
      alert('Added to shopping basket!');
    } catch (err) {
      alert(err.message || 'Please log in to add items to cart');
    }
  };

  const handleAddAllToCart = async () => {
    if (wishlistItems.length === 0) return;
    try {
      for (const item of wishlistItems) {
        await addToCart(item._id, 1);
      }
      alert('Added all wishlist items to shopping basket!');
    } catch (err) {
      alert(err.message || 'Error adding items to cart');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Wishlist link copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 fade-in">
      
      {/* Breadcrumbs & Back Link */}
      <div className="flex flex-col items-start gap-2.5 text-left">
        <Link 
          to="/" 
          className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-neutral-600">Wishlist</span>
        </nav>
      </div>

      {/* Header and buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="text-left">
          <h1 className="font-outfit font-extrabold text-3xl text-neutral-800">
            My Wishlist <span className="text-primary">({wishlistItems.length} items)</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">Items saved for your next culinary creation.</p>
        </div>

        {wishlistItems.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition-colors"
            >
              <Share2 size={14} />
              Share List
            </button>
            <button
              onClick={handleAddAllToCart}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-primary/10"
            >
              <ShoppingCart size={14} />
              Add All to Cart
            </button>
          </div>
        )}
      </div>

      {/* Wishlist items grid */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white border border-neutral-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm flex flex-col items-center gap-3">
          <div className="p-4 bg-primary-light text-primary rounded-full">
            <Sparkles size={36} />
          </div>
          <h3 className="font-outfit font-bold text-neutral-800 text-lg">Your Wishlist is Empty</h3>
          <p className="text-sm text-neutral-500 max-w-xs">
            Tap the heart icon on any food item to save it here for later.
          </p>
          <Link
            to="/shop"
            className="mt-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-colors"
          >
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => {
            const mainTag = product.tags && product.tags.length > 0 ? product.tags[0] : '';
            return (
              <div 
                key={product._id} 
                className="group relative bg-white border border-neutral-100 rounded-2xl p-4 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Delete button (X over image) */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className="absolute top-6 right-6 z-10 p-1.5 bg-white border border-neutral-100 text-neutral-400 hover:text-accent hover:border-accent-light rounded-full shadow-sm transition-all"
                >
                  <X size={14} />
                </button>

                {/* Product Image */}
                <div className="relative w-full aspect-square mb-4 bg-neutral-50 rounded-xl overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-4 text-left flex-grow flex flex-col justify-between">
                  <div>
                    {mainTag && (
                      <span className="text-[9px] font-bold text-primary uppercase tracking-wider block mb-1">
                        {mainTag}
                      </span>
                    )}
                    <h3 className="font-outfit font-bold text-neutral-800 text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    
                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-500">
                      <div className="flex text-secondary">
                        <Star size={10} fill="currentColor" />
                      </div>
                      <span className="font-bold text-neutral-800">{product.rating}</span>
                      <span>({product.reviewsCount} reviews)</span>
                    </div>
                  </div>

                  {/* Price and Add button */}
                  <div className="pt-3 border-t border-neutral-50 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-outfit font-extrabold text-base text-neutral-800">
                        ₹{product.price.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-neutral-400 capitalize block -mt-1">
                        / {product.unit}
                      </span>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(product._id)}
                      className="px-3.5 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ShoppingCart size={12} />
                      Quick Add
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Recommendations & Promo bottom banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8 border-t border-neutral-100 text-left">
        
        {/* Recommendation list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-outfit font-extrabold text-xl text-neutral-800">
            You Might Also Like
          </h2>
          
          {loadingRecs ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
              <div className="h-28 bg-neutral-100 rounded-2xl"></div>
              <div className="h-28 bg-neutral-100 rounded-2xl"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommendations.map(prod => (
                <div key={prod._id} className="flex gap-4 p-4 bg-white border border-neutral-100 rounded-2xl hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-neutral-50 rounded-xl overflow-hidden p-2 flex-shrink-0 flex items-center justify-center">
                    <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain rounded-lg" />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-outfit font-bold text-neutral-800 text-xs sm:text-sm line-clamp-1">{prod.name}</h4>
                      <span className="font-outfit font-extrabold text-sm text-neutral-800">₹{prod.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleQuickAdd(prod._id)}
                      className="text-primary hover:text-primary-dark font-bold text-[10px] flex items-center gap-1 text-left"
                    >
                      Quick Add <ShoppingCart size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Delivery Promotion card */}
        <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-6 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <span className="p-1.5 bg-amber-100 text-amber-600 rounded-lg inline-block">
              <Sparkles size={18} />
            </span>
            <h3 className="font-outfit font-extrabold text-base text-neutral-800">Free Delivery</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Enjoy free home delivery on all grocery baskets totaling $50 or more. Freshness and quality checked, straight to your doorstep.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 transition-colors"
          >
            Learn more <ChevronRight size={12} />
          </Link>
        </div>

      </div>

    </div>
  );
}
