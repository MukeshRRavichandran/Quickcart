import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Plus, Minus } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productsAPI } from '../services/api';
import NotifyModal from './NotifyModal';

export default function ProductCard({ product }) {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [loading, setLoading] = useState(false);
  const [stockError, setStockError] = useState('');
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [hasRequestedNotify, setHasRequestedNotify] = useState(false);

  const wishlisted = isWishlisted(product._id);
  const cartItem = cartItems.find(item => item.product && item.product._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const remainingStock = product.stock - quantity;

  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const btnRef = useRef(null);
  const heartRef = useRef(null);

  useGSAP(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const onEnter = () => {
      gsap.to(card, { y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", duration: 0.4, ease: "power2.out" });
      if (imgRef.current) gsap.to(imgRef.current, { scale: 1.1, duration: 0.5, ease: "power2.out" });
      if (btnRef.current) gsap.to(btnRef.current, { scale: 1.05, duration: 0.3, ease: "back.out(2)" });
    };
    
    const onLeave = () => {
      gsap.to(card, { y: 0, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", duration: 0.4, ease: "power2.out" });
      if (imgRef.current) gsap.to(imgRef.current, { scale: 1, duration: 0.5, ease: "power2.out" });
      if (btnRef.current) gsap.to(btnRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
    };
    
    card.addEventListener('mouseenter', onEnter);
    card.addEventListener('mouseleave', onLeave);
    
    return () => {
      card.removeEventListener('mouseenter', onEnter);
      card.removeEventListener('mouseleave', onLeave);
    };
  }, { scope: cardRef });

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Heart animation
    if (heartRef.current) {
      gsap.fromTo(heartRef.current, { scale: 1 }, { scale: 1.4, duration: 0.3, yoyo: true, repeat: 1, ease: "back.out(3)" });
    }
    
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
    
    // Flying cart animation
    if (imgRef.current) {
      const img = imgRef.current;
      const clone = img.cloneNode(true);
      const rect = img.getBoundingClientRect();
      clone.style.position = 'fixed';
      clone.style.top = `${rect.top}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.zIndex = 9999;
      clone.style.borderRadius = '50%';
      clone.style.objectFit = 'cover';
      document.body.appendChild(clone);

      const cartIcon = document.querySelector('nav a[href="/cart"]');
      const cartRect = cartIcon ? cartIcon.getBoundingClientRect() : { top: 20, left: window.innerWidth - 50 };

      gsap.to(clone, {
        x: cartRect.left - rect.left,
        y: cartRect.top - rect.top,
        scale: 0.1,
        opacity: 0.5,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          clone.remove();
          if (cartIcon) {
            gsap.fromTo(cartIcon, { scale: 1 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
          }
        }
      });
    }

    try {
      await addToCart(product._id, 1);
    } catch (err) {
      alert(err.message || 'Please login to add items to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleNotifyMe = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNotifyModalOpen(true);
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
    <>
    <div ref={cardRef} className={`group relative bg-white border border-neutral-100 rounded-2xl p-3 flex flex-col justify-between h-full hover-lift fade-in ${product.stock <= 0 ? 'opacity-75 grayscale-[0.3]' : ''}`}>

      <button
        onClick={handleWishlistToggle}
        className={`absolute top-2 right-2 p-2 rounded-full border z-20 transition-all duration-200 ${wishlisted
          ? 'bg-accent/10 border-accent/20 text-accent'
          : 'bg-white/90 border-neutral-100 text-neutral-400 hover:text-accent hover:bg-white'
          }`}
      >
        <div ref={heartRef}>
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </div>
      </button>

      <div className="relative w-full aspect-square mb-4 bg-neutral-50 rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 z-10 flex flex-col gap-0">
          {product.stock > 0 && product.stock < 5 && (
            <span className="bg-amber-500 text-white font-bold text-[8px] px-3 py-1 rounded-br-xl uppercase tracking-wider shadow-sm self-start">
              Limited Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-500 text-white font-bold text-[8px] px-3 py-1 rounded-br-xl uppercase tracking-wider shadow-sm self-start">
              Out of Stock
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#36641b] text-white font-bold text-[8px] px-3 py-1 rounded-br-xl uppercase tracking-wider shadow-sm self-start">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <Link to={`/product/${product._id}`}>
          <img
            ref={imgRef}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      <div className="flex flex-col justify-start text-left">
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

        <span className="text-[11px] font-medium text-neutral-500 capitalize block mt-1">
          {product.unit}
        </span>

        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="font-outfit font-extrabold text-base text-primary">
            ₹{product.price.toFixed(2)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-neutral-400 line-through">
              ₹{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="mt-1 min-h-[16px]">
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
              Only {remainingStock} left!
            </span>
          ) : (remainingStock === 0 && quantity > 0) ? (
            <span className="text-[10px] font-bold text-accent animate-pulse">
              Max quantity reached!
            </span>
          ) : null}
        </div>

        <div className="mt-2">
          {product.stock <= 0 ? (
            <button
              type="button"
              onClick={handleNotifyMe}
              disabled={hasRequestedNotify}
              className={`w-full py-2 font-bold text-xs rounded-lg border transition-colors ${
                hasRequestedNotify 
                  ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed' 
                  : 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
              }`}
            >
              {hasRequestedNotify ? '✓ Notification Requested' : 'Notify Me'}
            </button>
          ) : quantity > 0 ? (
            <div className="flex items-center justify-between bg-primary text-white rounded-lg p-1">
              <button
                onClick={handleDecrease}
                className="p-1 hover:bg-white/20 rounded-md transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="px-2 text-xs font-bold w-6 flex items-center justify-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="p-1 hover:bg-white/20 rounded-md transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              ref={btnRef}
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full py-2 bg-[#36641b] hover:bg-[#284913] text-white font-bold text-xs rounded-lg transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

    </div>
      <NotifyModal 
        product={product} 
        isOpen={isNotifyModalOpen} 
        onClose={() => setIsNotifyModalOpen(false)} 
        onSuccess={() => setHasRequestedNotify(true)}
      />
    </>
  );
}
