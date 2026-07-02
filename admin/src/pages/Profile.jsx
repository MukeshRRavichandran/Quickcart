import React, { useState } from 'react';
import { User, Shield, CheckCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Profile() {
  const { adminUser } = useAdmin();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setCurrentPassword('');
    setNewPassword('');
    showToast('Admin password reset successfully!');
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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Admin Account</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Configure credentials, passwords, and multi-factor authorization tokens.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: profile info */}
        <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <User size={18} className="text-primary" /> Profile Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-semibold text-neutral-600 pt-2">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Account Owner Name</span>
              <span className="text-neutral-800 text-base">{adminUser?.name || 'Admin Root'}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Corporate Email Address</span>
              <span className="text-neutral-800 text-base">{adminUser?.email || 'admin@quickcart.com'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Password form */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <Shield size={16} className="text-primary" /> Reset Password
          </h3>

          <form onSubmit={handlePasswordReset} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Current password *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs font-semibold outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">New password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs font-semibold outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              Reset Master Password
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
