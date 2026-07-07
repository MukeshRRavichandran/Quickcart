import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ordersAPI, couponsAPI } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, discount, tax, total, promoCode, clearCart, applyPromoCode, removePromoCode } = useCart();
  const [coupons, setCoupons] = useState([]);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  React.useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await couponsAPI.getActive();
        setCoupons(data);
      } catch (err) {
        console.error('Failed to load coupons', err);
      }
    };
    fetchCoupons();
  }, []);

  // Shipping Address State
  const [address, setAddress] = useState({
    name: 'Johnathan Doe',
    address: '482 Fresh Garden Way, Suite 102',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    phone: '+1 (555) 123-4567',
  });
  const [editingAddress, setEditingAddress] = useState(false);

  // Delivery Method State
  const [shippingMethod, setShippingMethod] = useState('Standard Delivery');
  const shippingCost = shippingMethod === 'Express Overnight' ? 12.99 : 0.00;

  // Card Payment State
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [card, setCard] = useState({
    cardholderName: 'Johnathan Doe',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (paymentMethod === 'Card') {
      if (!card.cardNumber || !card.expiryDate || !card.cvv) {
        setError('Please fill in card details.');
        return;
      }
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image
      }));

      const finalTotal = subtotal - discount + tax + shippingCost;

      const orderData = {
        items: orderItems,
        shippingAddress: address,
        shippingMethod,
        paymentMethod,
        subtotal,
        shippingCost,
        tax,
        total: finalTotal,
        promoCode
      };

      const createdOrder = await ordersAPI.create(orderData);
      
      // Clear basket locally
      clearCart();
      
      // Redirect to Order Confirmation
      navigate(`/order-confirmation/${createdOrder._id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error placing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">Your Basket is Empty</h2>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-bold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const finalTotal = subtotal - discount + tax + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 fade-in">
      
      {/* Progress Stepper */}
      <div className="max-w-xl mx-auto pt-4 pb-8">
        <div className="flex items-center justify-between relative">
          {/* Background line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-neutral-200 -z-10"></div>
          {/* Active indicator line */}
          <div className="absolute left-0 w-1/2 top-1/2 -translate-y-1/2 h-[2px] bg-primary -z-10"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1 bg-neutral-50 px-2">
            <span className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs">
              1
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-primary">Shipping</span>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1 bg-neutral-50 px-2">
            <span className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xs ring-4 ring-primary-light">
              2
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-primary">Payment</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1 bg-neutral-50 px-2">
            <span className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-400 font-bold flex items-center justify-center text-xs">
              3
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-neutral-400">Review</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns: Forms */}
        <div className="lg:col-span-2 space-y-6 text-left">
          
          {/* 1. Shipping Address */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-neutral-50 pb-3">
              <h3 className="font-outfit font-extrabold text-base text-neutral-800 flex items-center gap-2">
                <Truck size={18} className="text-primary" />
                Shipping Address
              </h3>
              <button 
                onClick={() => setEditingAddress(!editingAddress)}
                className="text-xs font-bold text-primary hover:underline"
              >
                {editingAddress ? 'Save Address' : 'Change'}
              </button>
            </div>

            {editingAddress ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-neutral-600">
                <div className="space-y-1">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={address.name}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={address.address}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label>Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={address.phone}
                    onChange={handleAddressChange}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-primary-light/35 border border-primary/10 rounded-2xl p-4 text-sm space-y-1">
                <div className="font-bold text-neutral-800">{address.name}</div>
                <div className="text-neutral-500">{address.address}</div>
                <div className="text-neutral-500">{address.city}, {address.state} {address.zipCode}</div>
                <div className="text-neutral-400 font-medium pt-1">{address.phone}</div>
              </div>
            )}
          </div>

          {/* 2. Shipping Method */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-3 flex items-center gap-2">
              <Truck size={18} className="text-primary" />
              Shipping Method
            </h3>

            <div className="space-y-3">
              <label 
                className={`flex justify-between items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                  shippingMethod === 'Standard Delivery'
                    ? 'border-primary bg-primary-light/20'
                    : 'border-neutral-100 hover:border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="Standard Delivery"
                    checked={shippingMethod === 'Standard Delivery'}
                    onChange={() => setShippingMethod('Standard Delivery')}
                    className="accent-primary"
                  />
                  <div>
                    <span className="font-bold text-neutral-800 text-sm block">Standard Delivery</span>
                    <span className="text-xs text-neutral-400">Arrives in 2-3 business days</span>
                  </div>
                </div>
                <span className="font-outfit font-bold text-sm text-primary">Free</span>
              </label>

              <label 
                className={`flex justify-between items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                  shippingMethod === 'Express Overnight'
                    ? 'border-primary bg-primary-light/20'
                    : 'border-neutral-100 hover:border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="Express Overnight"
                    checked={shippingMethod === 'Express Overnight'}
                    onChange={() => setShippingMethod('Express Overnight')}
                    className="accent-primary"
                  />
                  <div>
                    <span className="font-bold text-neutral-800 text-sm block">Express Overnight</span>
                    <span className="text-xs text-neutral-400">Farm-to-door in 24 hours</span>
                  </div>
                </div>
                <span className="font-outfit font-bold text-sm text-neutral-800">₹12.99</span>
              </label>
            </div>
          </div>

          {/* 3. Payment Details */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-5 shadow-sm">
            <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-primary" />
              Payment Details
            </h3>

            {/* Quick checkout */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => alert('Apple Pay selected')}
                className="py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex justify-center items-center gap-1.5 transition-colors"
              >
                <span> Apple Pay</span>
              </button>
              <button 
                type="button" 
                onClick={() => alert('Google Pay selected')}
                className="py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-xs font-bold text-neutral-700 flex justify-center items-center gap-1.5 transition-colors"
              >
                <span className="font-extrabold text-neutral-800"><span className="text-blue-500">G</span><span className="text-red-500">o</span><span className="text-yellow-500">o</span>g-Pay</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-100"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Select Payment Method</span>
              <div className="flex-grow border-t border-neutral-100"></div>
            </div>

            <div className="flex gap-4 mb-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'Card' ? 'border-primary bg-primary-light/20 text-primary' : 'border-neutral-200 text-neutral-600'}`}>
                <input type="radio" name="paymentMethod" value="Card" checked={paymentMethod === 'Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                <CreditCard size={16} />
                <span className="font-bold text-xs">Credit Card</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary-light/20 text-primary' : 'border-neutral-200 text-neutral-600'}`}>
                <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                <Truck size={16} />
                <span className="font-bold text-xs">Cash on Delivery</span>
              </label>
            </div>

            {/* Credit Card inputs */}
            <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs font-semibold text-neutral-600">
              {paymentMethod === 'Card' ? (
                <>
                  <div className="space-y-1">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardholderName"
                  value={card.cardholderName}
                  onChange={handleCardChange}
                  required
                  placeholder="Johnathan Doe"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={card.cardNumber}
                  onChange={handleCardChange}
                  required
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={card.expiryDate}
                    onChange={handleCardChange}
                    required
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={card.cvv}
                    onChange={handleCardChange}
                    required
                    placeholder="***"
                    maxLength={4}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-center"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="rounded text-primary focus:ring-primary accent-primary w-4 h-4"
                />
                <span className="text-xs font-semibold text-neutral-500">Save this card for future purchases</span>
              </label>
                </>
              ) : (
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-center font-bold text-xs border border-emerald-100">
                  You will pay in cash upon delivery of your order. Please have the exact amount ready if possible.
                </div>
              )}

              {error && <div className="text-xs text-accent font-bold pt-2">{error}</div>}

              {/* Invisible submit button to link enter-key forms */}
              <button type="submit" className="hidden" />
            </form>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="space-y-6 text-left">
          
          {/* Order Summary box */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-3">
              Order Summary
            </h3>

            {/* List products */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {cartItems.map((item) => {
                if (!item.product) return null;
                const { product, quantity } = item;
                return (
                  <div key={product._id} className="flex justify-between items-center gap-3">
                    <div className="flex gap-2.5 items-center">
                      <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain rounded-md" />
                      </div>
                      <div>
                        <h4 className="font-outfit font-bold text-neutral-800 text-xs line-clamp-1">{product.name}</h4>
                        <span className="text-[10px] text-neutral-400 block font-semibold">Qty: {quantity} • {product.unit}</span>
                      </div>
                    </div>
                    <span className="font-outfit font-bold text-xs text-neutral-800">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Section */}
            <div className="pt-4 border-t border-neutral-100">
              <h4 className="font-outfit font-bold text-sm text-neutral-800 mb-3">Promo Code</h4>
              
              {promoCode ? (
                <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <span className="font-bold text-xs uppercase tracking-wider">{promoCode}</span>
                    <span className="text-xs font-semibold">applied!</span>
                  </div>
                  <button 
                    onClick={removePromoCode}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter code" 
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                      className="flex-grow px-3 py-2 border border-neutral-200 rounded-lg text-sm outline-none focus:border-primary/50 transition-colors font-semibold"
                    />
                    <button 
                      onClick={async () => {
                        if (!couponInput) return;
                        try {
                          const success = await applyPromoCode(couponInput);
                          if (!success) setCouponError('Invalid or expired coupon');
                        } catch (err) {
                          setCouponError(err.message || 'Failed to apply coupon');
                        }
                      }}
                      className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-neutral-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500 font-semibold">{couponError}</p>}
                  
                  {/* Available Coupons List */}
                  {coupons.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1">
                      <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-2">Available Coupons</p>
                      {coupons.map(c => (
                        <div key={c._id} className="flex justify-between items-center p-2 border border-neutral-100 rounded-lg hover:border-primary/30 transition-colors cursor-pointer bg-neutral-50/50" onClick={() => setCouponInput(c.code)}>
                          <div>
                            <span className="font-bold text-xs text-primary block">{c.code}</span>
                            <span className="text-[10px] font-semibold text-neutral-500 line-clamp-1">{c.name}</span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setCouponInput(c.code);
                            }}
                            className="text-[10px] font-bold text-neutral-600 bg-white border border-neutral-200 px-2.5 py-1 rounded-md hover:border-primary/50 hover:text-primary transition-colors"
                          >
                            Select
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Financial Calculations */}
            <div className="space-y-3.5 text-xs text-neutral-500 font-semibold border-t border-neutral-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-neutral-800">₹{subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-primary font-bold">FREE</span>
                ) : (
                  <span className="text-neutral-800">${shippingCost.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="text-neutral-800">₹{tax.toFixed(2)}</span>
              </div>
              
              <div className="pt-4 border-t border-neutral-100 flex justify-between text-neutral-800">
                <span className="font-outfit font-extrabold text-sm">Total</span>
                <span className="font-outfit font-extrabold text-lg text-primary">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary-dark disabled:bg-neutral-300 text-white rounded-xl font-bold text-sm shadow-md shadow-primary/10 hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
            >
              {loading ? 'Processing...' : 'Place Order'}
              <ArrowRight size={16} />
            </button>

            {/* Encrypted trust badge */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-neutral-400 font-semibold pt-1 border-t border-neutral-50">
              <ShieldCheck size={14} className="text-primary" />
              <span>256-bit SSL Encrypted</span>
            </div>

          </div>

          {/* Carbon Neutral box */}
          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl flex-shrink-0">
              <Truck size={20} />
            </div>
            <div className="space-y-0.5 text-left">
              <h4 className="font-outfit font-bold text-neutral-800 text-sm">Carbon-Neutral Delivery</h4>
              <p className="text-xs text-neutral-500">We offset the carbon footprint of every delivery made.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
