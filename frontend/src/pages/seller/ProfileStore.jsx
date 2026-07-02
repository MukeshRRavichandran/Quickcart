import React, { useState } from 'react';
import { User, Store, Mail, Phone, MapPin, Save, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function ProfileStore() {
  const { profile, setProfile } = useSeller();

  const [formData, setFormData] = useState(profile);
  const [toastMessage, setToastMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    showToast('Store profile settings saved!');
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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Store Profile</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold font-outfit">Configure your store metadata, shipping contacts, and billing options.</p>
      </div>

      {/* Two Columns */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Profile Card & Business Toggles */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic store settings */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
              <Store size={18} className="text-primary" /> Store Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Store Name *</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-semibold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Store Phone Contact *</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Support Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-semibold"
                  required
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Business Hours</label>
                <input
                  type="text"
                  name="hours"
                  value={formData.hours}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Store Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Store Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-semibold"
                required
              />
            </div>
          </div>

          {/* Legal / Tax parameters */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" /> Tax & Business Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">GSTIN / Tax ID Number</label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-mono"
                  disabled
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Tax Filing Status</label>
                <div className="w-full px-3.5 py-2.5 bg-neutral-100 border border-transparent rounded-xl text-xs sm:text-sm text-neutral-500 font-bold">
                  Verified Active Filing
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Visual Layout, Bank Info & Save */}
        <div className="space-y-6 text-left">
          
          {/* Logo & Banner previews */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm space-y-4 text-center">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-neutral-100">
              <img src={formData.banner} alt="Store banner" className="w-full h-full object-cover" />
              <div className="absolute left-4 bottom-4 w-12 h-12 rounded-full border-2 border-white bg-white shadow-md overflow-hidden">
                <img src={formData.logo} alt="Store logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="text-left space-y-1.5 pt-2">
              <h4 className="font-outfit font-extrabold text-sm text-neutral-800">{formData.storeName}</h4>
              <p className="text-[10px] text-neutral-400 leading-normal">{formData.description}</p>
            </div>
          </div>

          {/* Banking accounts */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-3 flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Bank Account Details
            </h3>

            <div className="space-y-3.5 text-xs text-neutral-600 font-semibold">
              <div className="space-y-1">
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">Bank Institution</span>
                <span className="text-neutral-800 text-sm block">{formData.bankName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-neutral-400 uppercase tracking-widest block">Account Number</span>
                <span className="text-neutral-800 text-sm block">{formData.bankAccount}</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-sm shadow-md shadow-primary/10 hover:shadow-lg flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Save size={16} />
            <span>Save Store Profile</span>
          </button>

        </div>

      </form>

    </div>
  );
}
