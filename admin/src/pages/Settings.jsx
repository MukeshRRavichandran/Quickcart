import React, { useState } from 'react';
import { Settings, Shield, Bell, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [taxRate, setTaxRate] = useState(5.0);
  const [shippingRate, setShippingRate] = useState(5.99);
  
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Platform settings updated successfully!');
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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">System Configuration</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Modify platform taxes, checkout delivery fees, shipping thresholds, and notification configs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Form settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-5 text-left">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
              <Settings size={18} className="text-primary" /> Fee Thresholds
            </h3>

            <form onSubmit={handleSave} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block">Platform Tax cut (%) *</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    step="0.1"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs font-bold outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block">Standard Courier Shipping fee (₹) *</label>
                  <input
                    type="number"
                    value={shippingRate}
                    onChange={(e) => setShippingRate(Number(e.target.value))}
                    step="0.01"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs font-bold outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10"
              >
                Save Thresholds
              </button>
            </form>
          </div>

          {/* API keys */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
              <Shield size={18} className="text-primary" /> Integrated Gateways API Keys
            </h3>

            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Stripe Live Webhook Endpoint</label>
                <input
                  type="text"
                  value="https://api.quickcart.com/v1/stripe/webhooks"
                  className="w-full px-3.5 py-2.5 bg-neutral-100 border border-transparent rounded-xl text-xs text-neutral-500 font-mono"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: switches */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <Bell size={18} className="text-primary" /> Global Notification Switches
          </h3>

          <div className="divide-y divide-neutral-50 space-y-3.5 pt-1 text-xs">
            <div className="flex justify-between items-center py-2">
              <div>
                <h4 className="font-bold text-neutral-800">Email Customer Receits</h4>
                <p className="text-[10px] text-neutral-400">Dispatch transaction receipt emails on successful checkouts.</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <h4 className="font-bold text-neutral-800">SMS Courier Warnings</h4>
                <p className="text-[10px] text-neutral-400">Trigger warnings for fleet members when order states change.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
