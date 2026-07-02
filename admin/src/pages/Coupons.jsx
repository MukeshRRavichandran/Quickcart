import React, { useState } from 'react';
import { Tag, Plus, CheckCircle, Trash2, Calendar, Sparkles } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Coupons() {
  const { coupons, addCoupon } = useAdmin();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Percentage');
  const [value, setValue] = useState('');
  
  const [toastMessage, setToastMessage] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim() || !value) return;

    addCoupon(code.trim(), type, Number(value), name.trim());
    setCode('');
    setName('');
    setValue('');
    showToast('Platform coupon launched successfully!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  return (
    <div className="space-y-6 text-left relative font-outfit">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-neutral-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-pulse">
          <CheckCircle size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Coupons & Campaigns</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Launch platform-wide discount codes, combo offers, and seasonal cashbacks.</p>
      </div>

      {/* Grid: coupons index list and builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: coupons list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2">
            Active Campaign Codes
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <div 
                key={c.id} 
                className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden text-left hover:border-primary/10 transition-colors"
              >
                <div className="absolute right-0 bottom-0 top-0 w-2 opacity-5 bg-primary"></div>
                
                <div className="space-y-1">
                  <span className="bg-primary/10 text-primary font-bold text-[8px] px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-max">
                    {c.type} Discount
                  </span>
                  <h4 className="font-outfit font-extrabold text-neutral-800 text-base leading-snug">{c.name}</h4>
                </div>

                <div className="flex justify-between items-end pt-2 border-t border-neutral-50">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-neutral-400 font-semibold block">Promo Code</span>
                    <span className="font-mono text-sm font-bold text-neutral-800 bg-neutral-50 px-2 py-0.5 rounded-md border border-neutral-250">
                      {c.code}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 font-semibold block">Value</span>
                    <span className="font-outfit font-extrabold text-lg text-primary">
                      {c.type === 'Percentage' ? `${c.value}%` : `$${c.value}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Coupon Builder Form */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <Sparkles size={16} className="text-primary" /> Create Campaign
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Campaign Name *</label>
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
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Promo Code *</label>
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
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Discount Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Flat">Flat rate ($)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Value *</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus size={14} />
              <span>Launch Promo</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
