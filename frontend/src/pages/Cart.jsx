import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Minus, ArrowRight, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../services/api';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    tax,
    shipping,
    total,
    promoCode,
    applyPromoCode,
    removePromoCode
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [recipeRecs, setRecipeRecs] = useState([]);

  // Load recipe recommendations (items NOT in the cart)
  useEffect(() => {
    const fetchRecipeRecs = async () => {
      try {
        const data = await productsAPI.getAll();
        const cartIds = cartItems.map(item => item.product?._id);
        const filtered = data.filter(p => !cartIds.includes(p._id));
        // Take Fresh Basil and Artisan Feta as recommendations if available
        const basil = filtered.find(p => p.name.includes('Basil'));
        const feta = filtered.find(p => p.name.includes('Feta'));
        
        let recs = [];
        if (basil) recs.push(basil);
        if (feta) recs.push(feta);
        
        // Fallback
        if (recs.length < 2) {
          recs = [...recs, ...filtered.slice(0, 2 - recs.length)];
        }
        setRecipeRecs(recs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipeRecs();
  }, [cartItems]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;

    const success = applyPromoCode(promoInput);
    if (!success) {
      setPromoError('Invalid promo code. Try "FRESH20"');
    }
  };

  const handleProceed = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 fade-in">
      
      {/* Page Title & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="font-outfit font-extrabold text-3xl text-neutral-800">Your Shopping Basket</h1>
          <p className="text-xs text-neutral-400 mt-1">Review your organic selection and proceed to checkout.</p>
        </div>
        <Link 
          to="/shop" 
          className="flex items-center gap-1.5 text-sm font-bold text-neutral-600 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-neutral-100 rounded-3xl p-16 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="p-4 bg-primary-light text-primary rounded-full inline-block">
            <Sparkles size={36} />
          </div>
          <h3 className="font-outfit font-bold text-neutral-800 text-lg">Your Basket is Empty</h3>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto">
            You haven't added any fresh items to your basket yet.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm transition-colors"
          >
            Explore Groceries
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Basket Items and Recommendations */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basket Items List */}
            <div className="space-y-4">
              {cartItems.map((item) => {
                if (!item.product) return null;
                const { product, quantity } = item;
                const itemTotal = product.price * quantity;
                const mainTag = product.tags && product.tags.length > 0 ? product.tags[0] : '';
                
                return (
                  <div 
                    key={product._id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-white border border-neutral-100 rounded-2xl shadow-sm hover:border-primary/10 transition-all text-left"
                  >
                    
                    {/* Image and Info */}
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-neutral-50 border border-neutral-100 rounded-xl p-1 flex-shrink-0 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain rounded-lg" />
                      </div>
                      <div className="space-y-1">
                        {mainTag && (
                          <span className="bg-primary-light text-primary font-bold text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">
                            {mainTag}
                          </span>
                        )}
                        <h3 className="font-outfit font-bold text-neutral-800 text-base leading-snug">{product.name}</h3>
                        <p className="text-xs text-neutral-400">Sourced from Local Farms • {product.unit}</p>
                      </div>
                    </div>

                    {/* Quantity & Pricing */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-none pt-3 sm:pt-0">
                      
                      {/* Price */}
                      <div className="text-left sm:text-right">
                        <span className="font-outfit font-extrabold text-base text-neutral-800 block">
                          ${itemTotal.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-neutral-400 block">${product.price.toFixed(2)} each</span>
                      </div>

                      {/* Qty selector */}
                      <div className="flex items-center bg-neutral-100 rounded-xl p-1 border border-neutral-200">
                        <button
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          className="p-1 bg-white hover:bg-neutral-50 rounded-lg text-neutral-600 shadow-sm transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 font-outfit font-bold text-neutral-800 min-w-[24px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="p-1 bg-white hover:bg-neutral-50 rounded-lg text-neutral-600 shadow-sm transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="p-2 text-neutral-400 hover:text-accent hover:bg-accent-light/35 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>

            {/* Complete Your Recipe recommendations */}
            <div className="space-y-4 pt-4 border-t border-neutral-100 text-left">
              <div>
                <h3 className="font-outfit font-extrabold text-lg text-neutral-800">Complete your recipe</h3>
                <p className="text-xs text-neutral-400">Popular items matching your selection</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recipeRecs.map(prod => (
                  <div 
                    key={prod._id}
                    className="flex gap-4 p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm items-center hover:border-primary/10 transition-all"
                  >
                    <div className="w-16 h-16 bg-neutral-50 rounded-xl overflow-hidden p-1.5 flex-shrink-0 flex items-center justify-center">
                      <img src={prod.image} alt={prod.name} className="max-h-full max-w-full object-contain rounded-lg" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-outfit font-bold text-neutral-800 text-sm line-clamp-1">{prod.name}</h4>
                      <span className="font-outfit font-extrabold text-xs text-primary">${prod.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => updateQuantity(prod._id, 1)}
                      className="px-3 py-1.5 bg-primary-light hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-bold transition-all"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary Card */}
          <div className="space-y-6 text-left">
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-6 shadow-sm">
              <h3 className="font-outfit font-extrabold text-lg text-neutral-800 border-b border-neutral-50 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3.5 text-sm text-neutral-500 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-800 font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount (20%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-primary font-bold">FREE</span>
                  ) : (
                    <span className="text-neutral-800 font-semibold">${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Tax Estimation</span>
                  <span className="text-neutral-800 font-semibold">${tax.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex justify-between text-neutral-800">
                  <span className="font-outfit font-extrabold text-base">Total</span>
                  <span className="font-outfit font-extrabold text-xl text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo code input */}
              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <span className="text-xs text-neutral-400 font-bold block">Promo Code</span>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-primary-light/45 border border-primary/20 text-primary px-3 py-2 rounded-xl text-xs font-semibold">
                    <span>Code {promoCode} Applied!</span>
                    <button onClick={removePromoCode} className="text-accent hover:underline font-bold text-[10px]">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. FRESH20"
                      className="flex-grow px-3 py-2.5 bg-neutral-50 text-xs rounded-xl outline-none border border-neutral-200 focus:bg-white focus:border-primary/20 transition-all uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && <span className="text-[10px] text-accent font-bold block">{promoError}</span>}
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceed}
                className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-md shadow-primary/10 hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>

              {/* Badges */}
              <div className="space-y-3.5 text-xs text-neutral-400 pt-4 border-t border-neutral-50 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>Secure encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
                  <span>Est. Delivery: Today, 5:00 PM - 7:00 PM</span>
                </div>
              </div>

            </div>

            {/* Need Help card */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl flex-shrink-0">
                <HelpCircle size={20} />
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="font-outfit font-bold text-neutral-800 text-sm">Need help?</h4>
                <p className="text-xs text-neutral-500">Our farm experts are available 24/7 at support@quickcart.com</p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
