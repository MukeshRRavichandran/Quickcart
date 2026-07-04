import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Mail, ShieldCheck, Box, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleExpandOrder = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'Shipped':
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 fade-in text-left">
      
      <h1 className="font-outfit font-extrabold text-3xl text-neutral-800">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Profile Card */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-6 shadow-sm">
          <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-3 flex items-center gap-2">
            <User size={18} className="text-primary" />
            Profile Details
          </h3>

          <div className="flex flex-col items-center text-center space-y-3 pt-2">
            <div className="w-16 h-16 rounded-full bg-primary-light text-primary font-outfit font-extrabold text-2xl flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-outfit font-bold text-neutral-800 text-base">{user?.name}</h4>
              <span className="bg-neutral-100 text-neutral-500 font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">
                {user?.role} Portal User
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-neutral-50 text-xs font-semibold text-neutral-500">
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-neutral-400" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-neutral-400" />
              <span>Status: Active</span>
            </div>
          </div>
        </div>

        {/* Right Column: Orders History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-outfit font-extrabold text-lg text-neutral-800 flex items-center gap-2">
            <Box size={18} className="text-primary" />
            Order History <span className="text-primary-dark">({orders.length})</span>
          </h3>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 bg-neutral-100 rounded-2xl"></div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-neutral-100 rounded-3xl p-12 text-center shadow-sm space-y-4 flex flex-col items-center gap-2">
              <div className="p-4 bg-neutral-50 text-neutral-400 rounded-full">
                <Box size={36} />
              </div>
              <h4 className="font-outfit font-bold text-neutral-800 text-base">No Orders Yet</h4>
              <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                You haven't placed any grocery orders yet. Start adding items to your shopping basket!
              </p>
              <Link
                to="/shop"
                className="inline-block px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const date = new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
                const isExpanded = expandedOrderId === order._id;

                return (
                  <div 
                    key={order._id}
                    className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden hover:border-primary/10 transition-all"
                  >
                    
                    {/* Summary row */}
                    <div 
                      onClick={() => toggleExpandOrder(order._id)}
                      className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Order ID</span>
                        <span className="font-outfit font-bold text-xs text-neutral-700 block">#{order._id}</span>
                      </div>
                      
                      <div>
                        <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Date</span>
                        <span className="text-xs text-neutral-500 font-semibold block">{date}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Total Amount</span>
                        <span className="font-outfit font-extrabold text-sm text-primary block">₹{order.total.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        {isExpanded ? <ChevronUp size={16} className="text-neutral-400" /> : <ChevronDown size={16} className="text-neutral-400" />}
                      </div>
                    </div>

                    {/* Collapsible detail content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-neutral-50 pt-4 space-y-4 bg-neutral-50/40 text-xs font-semibold text-neutral-600">
                        
                        {/* Mini thumbnails and names */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Items Summary</span>
                          <div className="space-y-2 bg-white p-3.5 border border-neutral-100 rounded-xl">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="text-neutral-700">{item.name} <span className="text-neutral-400 font-medium">x {item.quantity}</span></span>
                                <span className="text-neutral-800">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping address details */}
                        <div>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mb-1">Delivering to</span>
                          <div className="text-neutral-500 leading-normal">
                            {order.shippingAddress.name} <br />
                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode} <br />
                            Phone: {order.shippingAddress.phone}
                          </div>
                        </div>

                        {/* Shipping status tracker */}
                        <div className="flex items-center justify-between gap-1.5 text-[10px] text-neutral-400">
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            <span>Delivery method selected: {order.shippingMethod}</span>
                          </div>
                          
                          {['Pending', 'Confirmed', 'Processing'].includes(order.status) && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to cancel this order?')) {
                                  try {
                                    await ordersAPI.cancel(order._id);
                                    const updated = await ordersAPI.getAll();
                                    setOrders(updated);
                                  } catch (err) {
                                    alert(err.message || 'Failed to cancel order.');
                                  }
                                }
                              }}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-655 rounded-lg font-bold text-[10px] transition-colors border border-red-100"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
