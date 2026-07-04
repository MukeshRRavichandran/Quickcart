import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Phone, Mail, CreditCard, ClipboardList, CheckCircle, Package, Truck, Smile } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useSeller();

  const order = orders.find((o) => o.id === id);

  const [toastMessage, setToastMessage] = useState('');

  if (!order) {
    return (
      <div className="bg-white border border-neutral-100 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
        <ClipboardList size={36} className="text-neutral-400 mx-auto" />
        <h3 className="font-outfit font-bold text-neutral-800 text-lg">Order Not Found</h3>
        <Link to="/seller/orders" className="text-primary font-bold text-sm hover:underline flex items-center justify-center gap-1.5">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
      </div>
    );
  }

  const handleStatusChange = (status) => {
    updateOrderStatus(order.id, status);
    setToastMessage(`Status updated to "${status}"!`);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const steps = [
    { key: 'New', label: 'Order Placed', icon: ClipboardList, desc: 'Client placed order.' },
    { key: 'Processing', label: 'Processing', icon: Package, desc: 'Sellers picking inventory.' },
    { key: 'Packed', label: 'Packed & Sealed', icon: CheckCircle, desc: 'Items packed in crate.' },
    { key: 'Shipped', label: 'Out for Delivery', icon: Truck, desc: 'Courier en route.' },
    { key: 'Delivered', label: 'Delivered', icon: Smile, desc: 'Fulfillment successfully verified.' }
  ];

  const currentStepIdx = steps.findIndex(s => s.key === order.deliveryStatus);

  return (
    <div className="space-y-6 text-left relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-neutral-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-pulse">
          <CheckCircle size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/seller/orders"
          className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Order Details #{order.id}</h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Track invoice details, delivery logs, and packaging state.</p>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Crate Items and Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-3">
              Crate Contents
            </h3>

            <div className="divide-y divide-neutral-50 space-y-3">
              {order.items.map((item, idx) => {
                const total = item.price * item.quantity;
                return (
                  <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0 gap-3">
                    <div className="text-left space-y-0.5">
                      <h4 className="font-outfit font-bold text-neutral-800 text-sm">{item.product}</h4>
                      <span className="text-[10px] text-neutral-400 font-semibold">
                        Quantity: x{item.quantity} • Unit Price: ₹{item.price.toFixed(2)}
                      </span>
                    </div>
                    <span className="font-outfit font-extrabold text-sm text-neutral-800">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dynamic Timeline tracker */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-3">
              Fulfillment Timeline
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-100">
              {steps.map((s, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                const Icon = s.icon;

                return (
                  <div key={s.key} className="relative flex gap-4 text-left">
                    {/* Node Dot icon */}
                    <div className={`absolute -left-[23px] p-1 rounded-full border-4 z-10 transition-all ${
                      isCurrent 
                        ? 'bg-primary border-primary-light text-white ring-4 ring-primary-light/20' 
                        : isCompleted 
                        ? 'bg-emerald-100 border-white text-emerald-600' 
                        : 'bg-neutral-50 border-white text-neutral-300'
                    }`}>
                      <Icon size={12} />
                    </div>

                    <div className="space-y-0.5">
                      <h4 className={`text-xs font-bold ${isCurrent ? 'text-primary' : 'text-neutral-700'}`}>
                        {s.label}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-medium">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Customer Card & Fulfillment Control */}
        <div className="space-y-6 text-left">
          
          {/* Fulfill actions */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2">
              Fulfillment Actions
            </h3>
            
            <div className="flex flex-col gap-2">
              <button
                disabled={order.deliveryStatus === 'Delivered'}
                onClick={() => {
                  const nexts = {
                    'New': 'Processing',
                    'Processing': 'Packed',
                    'Packed': 'Shipped',
                    'Shipped': 'Delivered'
                  };
                  handleStatusChange(nexts[order.deliveryStatus]);
                }}
                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {order.deliveryStatus === 'Delivered' ? 'Fully Completed' : 'Proceed to Next State'}
              </button>
              
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-50 mt-2">
                {steps.map(s => (
                  <button
                    key={s.key}
                    onClick={() => handleStatusChange(s.key)}
                    className={`py-2 text-[10px] font-bold rounded-lg transition-colors border ${
                      order.deliveryStatus === s.key 
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'bg-neutral-50 text-neutral-500 border-transparent hover:bg-neutral-100'
                    }`}
                  >
                    {s.key}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-3 flex items-center gap-2">
              <User size={16} className="text-primary" /> Customer Info
            </h3>

            <div className="space-y-3.5 text-xs text-neutral-600 font-semibold">
              <div className="flex items-center gap-2">
                <Smile size={16} className="text-neutral-400" />
                <span>{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-neutral-400" />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-neutral-400" />
                <span>{order.customer.phone}</span>
              </div>
              <div className="flex items-start gap-2 border-t border-neutral-50 pt-3 mt-3">
                <MapPin size={16} className="text-neutral-400 mt-0.5" />
                <span className="leading-relaxed">{order.customer.address}</span>
              </div>
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-3 flex items-center gap-2">
              <CreditCard size={16} className="text-primary" /> Invoice Breakdown
            </h3>

            <div className="space-y-3 text-xs text-neutral-500 font-semibold">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="text-neutral-800">Stripe Integration</span>
              </div>
              <div className="flex justify-between">
                <span>Billing Status</span>
                <span className="text-emerald-600 font-bold uppercase">PAID</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-50 text-neutral-800">
                <span className="font-extrabold">Paid amount</span>
                <span className="font-extrabold text-sm text-primary">₹{order.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
