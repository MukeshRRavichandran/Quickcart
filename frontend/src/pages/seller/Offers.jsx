import React, { useState } from 'react';
import { Tag, Plus, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function Offers() {
  const { offers, addOffer } = useSeller();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Percentage');
  const [value, setValue] = useState(0);
  const [endDate, setEndDate] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleCreateOffer = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    addOffer({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      type,
      value: Number(value),
      startDate: new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-12-31'
    });

    setCode('');
    setName('');
    setValue(0);
    setEndDate('');
    showToast('Promo campaign created successfully!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

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
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Offers & Campaigns</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Boost store conversions by introducing custom promo coupons and flat rate campaigns.</p>
      </div>

      {/* Column layout: list and creation form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Campaigns List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2">
            Active Store Coupons
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden text-left hover:border-primary/10 transition-colors"
              >
                <div className="absolute right-0 bottom-0 top-0 w-2 opacity-5 bg-primary"></div>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="bg-primary/10 text-primary font-bold text-[8px] px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-max">
                      {offer.type}
                    </span>
                    <h4 className="font-outfit font-extrabold text-neutral-800 text-base leading-snug">{offer.name}</h4>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-neutral-50">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-400 font-semibold block">Promo Code</span>
                    <span className="font-mono text-sm font-bold text-neutral-800 bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-200">
                      {offer.code}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 font-semibold block">Discount Value</span>
                    <span className="font-outfit font-extrabold text-lg text-primary">
                      {offer.type === 'Percentage' ? `${offer.value}%` : offer.type === 'Free Shipping' ? 'FREE' : `$${offer.value}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] text-neutral-400 pt-1 border-t border-neutral-50/50">
                  <Calendar size={10} />
                  <span>Expires: {offer.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Campaign Creator Form */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-primary" /> Create Campaign
          </h3>

          <form onSubmit={handleCreateOffer} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Coupon Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Monsoon Clearance Deal"
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700 transition-all font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Coupon Code *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MONSOON30"
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700 transition-all font-mono"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700 transition-all font-semibold"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Flat Rate">Flat Rate ($)</option>
                  <option value="Free Shipping">Free Shipping</option>
                </select>
              </div>

              {type !== 'Free Shipping' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block">Value</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700 transition-all font-bold"
                    required
                  />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700 transition-all font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus size={14} />
              <span>Launch Campaign</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
