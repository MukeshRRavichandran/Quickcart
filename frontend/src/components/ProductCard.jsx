import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [loading, setLoading] = useState(false);
  const [stockError, setStockError] = useState('');

  const wishlisted = isWishlisted(product._id);
  const cartItem = cartItems.find(item => item.product && item.product._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const remainingStock = product.stock - quantity;

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
    setStockError('');
    if (product.stock <= 0) {
      setStockError('Out of stock');
      return;
    }
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
    setStockError('');
    if (quantity + 1 > product.stock) {
      setStockError('Max quantity reached');
      setTimeout(() => setStockError(''), 3000);
      return;
    }
    await updateQuantity(product._id, quantity + 1);
  };

  const handleDecrease = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setStockError('');
    await updateQuantity(product._id, quantity - 1);
  };

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const mainTag = product.tags && product.tags.length > 0 ? product.tags[0] : '';

  return (
    <div className="group relative bg-white border border-neutral-100 rounded-2xl p-3 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col justify-between h-full hover-lift fade-in">

      <button
        onClick={handleWishlistToggle}
        className={`absolute top-2 right-2 p-2 rounded-full border z-20 transition-all duration-200 ${wishlisted
          ? 'bg-accent/10 border-accent/20 text-accent'
          : 'bg-white/90 border-neutral-100 text-neutral-400 hover:text-accent hover:bg-white'
          }`}
      >
        <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      <div className="relative w-full aspect-square mb-4 bg-neutral-50 rounded-xl overflow-hidden">
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
          {product.stock > 0 && product.stock < 5 && (
            <span className="bg-amber-500 text-white font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm self-start">
              Limited Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-500 text-white font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm self-start">
              Out of Stock
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-accent text-white font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm self-start">
              {discountPercent}% OFF
            </span>
          )}
        </div>

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
            <h3 className="font-outfit font-bold text-neutral-800 text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mt-1 text-xs text-neutral-500">
            <div className="flex text-secondary">
              <Star size={12} fill="currentColor" />
            </div>
            <span className="font-semibold text-neutral-800">{product.rating || '4.5'}</span>
          </div>

          <div className="mt-2 min-h-[16px]">
            {stockError ? (
              <span className="text-[10px] font-bold text-accent animate-pulse">
                {stockError}
              </span>
            ) : product.stock <= 0 ? (
              <span className="text-[10px] font-bold text-red-500">
                Out of Stock
              </span>
            ) : (remainingStock > 0 && remainingStock < 5) ? (
              <span className="text-[10px] font-bold text-amber-500">
                Only {remainingStock} left in stock!
              </span>
            ) : (remainingStock === 0 && quantity > 0) ? (
              <span className="text-[10px] font-bold text-accent animate-pulse">
                Max quantity reached!
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-50 flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex-shrink-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-outfit font-extrabold text-base text-neutral-800">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xs text-neutral-400 line-through hidden sm:inline">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-neutral-400 capitalize block -mt-0.5">
                / {product.unit}
              </span>
            </div>

            <div className="flex-shrink-0 mt-1 sm:mt-0">
              {product.stock <= 0 ? (
                <button
                  type="button"
                  disabled
                  className="px-3 py-1.5 bg-neutral-100 text-neutral-400 font-bold text-[10px] uppercase tracking-wider rounded-lg border border-neutral-200 cursor-not-allowed flex-shrink-0"
                >
                  Notify Me
                </button>
              ) : quantity > 0 ? (
                <div className="flex items-center bg-neutral-100 rounded-full p-1 border border-neutral-200">
                  <button
                    onClick={handleDecrease}
                    className="p-1 hover:bg-white rounded-full text-neutral-600 transition-colors flex-shrink-0"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-2 text-xs font-bold text-neutral-800 w-6 flex items-center justify-center">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    className="p-1 hover:bg-white rounded-full text-neutral-600 transition-colors flex-shrink-0"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors flex items-center justify-center flex-shrink-0"
                >
                  <ShoppingBag size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
