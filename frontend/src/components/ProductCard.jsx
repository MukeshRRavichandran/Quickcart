import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  
  const [loading, setLoading] = useState(false);

  const wishlisted = isWishlisted(product._id);
  const cartItem = cartItems.find(item => item.product && item.product._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(product._id);
    } catch (err) {
      alert(err.message || 'Please log in first.');
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await addToCart(product._id, 1);
    } catch (err) {
      alert(err.message || 'Please login to add items to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await updateQuantity(product._id, quantity + 1);
  };

  const handleDecrease = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await updateQuantity(product._id, quantity - 1);
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const mainTag = product.tags && product.tags.length > 0 ? product.tags[0] : '';

  return (
    <div className="group relative bg-white border border-neutral-100 rounded-2xl p-4 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-full hover-lift fade-in">
      
      <div className="relative w-full aspect-square mb-4 bg-neutral-50 rounded-xl overflow-hidden">
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {product.tags && product.tags.includes('Organic') && (
            <span className="bg-emerald-500 text-white font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm self-start">
              Organic
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-accent text-white font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm self-start">
              {discountPercent}% OFF
            </span>
          )}
        </div>
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full border z-10 transition-all duration-200 ${
            wishlisted
              ? 'bg-accent/10 border-accent/20 text-accent'
              : 'bg-white/80 border-neutral-100 text-neutral-400 hover:text-accent hover:bg-white'
          }`}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>

      <div className="flex-grow flex flex-col justify-between">
        <div>
          {mainTag && (
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">
              {mainTag}
            </span>
          )}
          
          <Link to={`/product/${product._id}`}>
            <h3 className="font-outfit font-bold text-neutral-800 text-base leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
            <div className="flex text-secondary">
              <Star size={12} fill="currentColor" />
            </div>
            <span className="font-semibold text-neutral-800">{product.rating || '4.5'}</span>
            <span>({product.reviewsCount || '0'} reviews)</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-50 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-outfit font-extrabold text-lg text-neutral-800">
                ₹{product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-400 capitalize block -mt-0.5">
              / {product.unit}
            </span>
          </div>

          <div>
            {quantity > 0 ? (
              <div className="flex items-center bg-neutral-100 rounded-full p-1 border border-neutral-200">
                <button
                  onClick={handleDecrease}
                  className="p-1 hover:bg-white rounded-full text-neutral-600 transition-colors"
                >
                  <Minus size={12} />
                </button>
                <span className="px-2 text-xs font-bold text-neutral-800 min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-1 hover:bg-white rounded-full text-neutral-600 transition-colors"
                >
                  <Plus size={12} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors flex items-center justify-center"
              >
                <ShoppingBag size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
