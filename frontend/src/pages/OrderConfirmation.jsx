import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, ShieldCheck, ShoppingBag, ListOrdered } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ordersAPI } from '../services/api';

export default function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const checkRef = useRef(null);

  useGSAP(() => {
    if (!order) return;
    
    // Checkmark animation
    if (checkRef.current) {
      gsap.fromTo(checkRef.current, { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(2)" });
    }
    
    // Summary details stagger
    gsap.fromTo(".summary-item", 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power2.out" }
    );
    
    // Confetti
    const createConfetti = () => {
      const colors = ['#7cc157', '#36641b', '#EAF0EC', '#fcd34d', '#f43f5e', '#3b82f6'];
      for (let i = 0; i < 75; i++) {
        const conf = document.createElement('div');
        conf.className = 'fixed w-2 h-2 rounded-full z-50 pointer-events-none';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.left = '50%';
        conf.style.top = '20%';
        document.body.appendChild(conf);
        
        gsap.to(conf, {
          x: (Math.random() - 0.5) * window.innerWidth,
          y: Math.random() * window.innerHeight + 200,
          rotation: Math.random() * 360 * 3,
          opacity: 0,
          duration: Math.random() * 2 + 1.5,
          ease: "power2.out",
          onComplete: () => conf.remove()
        });
      }
    };
    
    setTimeout(createConfetti, 300);
    
  }, { scope: containerRef, dependencies: [order] });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await ordersAPI.getById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-pulse space-y-6">
        <div className="w-16 h-16 bg-neutral-100 rounded-full mx-auto"></div>
        <div className="h-8 w-2/3 bg-neutral-100 rounded mx-auto"></div>
        <div className="h-32 bg-neutral-100 rounded-2xl"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">Order Not Found</h2>
        <p className="text-sm text-neutral-500">We couldn't retrieve the details for this order confirmation.</p>
        <Link to="/" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-bold">
          Go to Home
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto px-4 py-12 space-y-8 fade-in relative">
      
      {/* Success Badge */}
      <div className="text-center space-y-3">
        <div ref={checkRef} className="inline-flex p-3 bg-primary-light text-primary rounded-full">
          <CheckCircle size={48} fill="currentColor" className="text-white" />
        </div>
        <h1 className="font-outfit font-extrabold text-3xl text-neutral-800">Order Confirmed!</h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          Thank you for shopping at Quickcart. Your order has been placed and is currently being prepared.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm divide-y divide-neutral-100 space-y-6 text-left relative z-10">
        
        {/* Order Details Header */}
        <div className="summary-item grid grid-cols-2 gap-4 pb-4">
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Order ID</span>
            <span className="font-outfit font-bold text-sm text-neutral-800 truncate block">#{order._id}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Date</span>
            <span className="font-outfit font-bold text-sm text-neutral-800 block flex items-center gap-1">
              <Calendar size={14} className="text-neutral-400" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Shipping details */}
        <div className="summary-item py-4 space-y-2">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Shipping Address</span>
          <div className="text-sm font-semibold text-neutral-800">
            {order.shippingAddress.name}
          </div>
          <div className="text-xs text-neutral-500">
            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </div>
          <div className="text-xs text-neutral-400">
            {order.shippingAddress.phone} • {order.shippingMethod}
          </div>
        </div>

        {/* Items List */}
        <div className="summary-item py-4 space-y-3">
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Items Ordered</span>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center gap-4 text-xs font-semibold">
                <div className="flex gap-2.5 items-center">
                  <img src={item.image} alt={item.name} className="w-8 h-8 rounded border object-contain p-0.5" />
                  <div>
                    <span className="text-neutral-800">{item.name}</span>
                    <span className="text-neutral-400 block text-[10px]">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="text-neutral-800">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Summary */}
        <div className="summary-item pt-4 space-y-2 text-xs font-semibold text-neutral-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-neutral-800">₹{order.subtotal.toFixed(2)}</span>
          </div>
          {order.promoCode && (
            <div className="flex justify-between text-primary">
              <span>Promo Discount</span>
              <span>-20%</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-800 text-sm border-t border-neutral-100 pt-3">
            <span className="font-outfit font-extrabold">Total Paid</span>
            <span className="font-outfit font-extrabold text-primary">₹{order.total.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* Action Redirects */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/profile"
          className="px-6 py-3.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <ListOrdered size={16} />
          View My Orders
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-sm shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag size={16} />
          Continue Shopping
        </Link>
      </div>

    </div>
  );
}
