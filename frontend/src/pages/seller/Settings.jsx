import React, { useState } from 'react';
import { Settings, Shield, Bell, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [notifications, setNotifications] = useState({
    orders: true,
    inventory: true,
    payments: false,
    offers: true
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    setCurrentPassword('');
    setNewPassword('');
    showToast('Account password updated successfully!');
  };

  const toggleNoti = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    showToast('Notification preference updated!');
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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Settings</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold font-outfit">Configure API integrations, client updates, security configurations, and notifications.</p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Security and API */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Change Password Form */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
              <Shield size={18} className="text-primary" /> Update Password
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-1">
              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Current Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-7 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="space-y-1 relative">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">New Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Change Password
              </button>
            </form>
          </div>

          {/* Mocks API credentials */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
              <Settings size={18} className="text-primary" /> API Configurations
            </h3>

            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Production Webhook Callback URL</label>
                <input
                  type="text"
                  value="https://api.harvestfresh.com/v1/webhooks/payouts"
                  className="w-full px-3.5 py-2.5 bg-neutral-100 border border-transparent rounded-xl text-xs text-neutral-500 font-mono"
                  disabled
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Developer Secret Key</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value="sk_live_51M..."
                    className="flex-grow px-3.5 py-2.5 bg-neutral-100 border border-transparent rounded-xl text-xs text-neutral-500 font-mono"
                    disabled
                  />
                  <button 
                    type="button" 
                    onClick={() => showToast('API credentials copied!')}
                    className="px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-xl text-xs font-bold transition-all"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Preferences Toggles */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <Bell size={18} className="text-primary" /> Notifications Preferences
          </h3>

          <div className="divide-y divide-neutral-50 space-y-3.5 pt-1">
            {[
              { key: 'orders', title: 'New Sales Alerts', desc: 'Notify me when clients submit payment checkout.' },
              { key: 'inventory', title: 'Low Stock warnings', desc: 'Trigger warnings when stock drops under 20.' },
              { key: 'payments', title: 'Payout Confirmation', desc: 'Notify on settled ledger updates.' },
              { key: 'offers', title: 'Campaign reminders', desc: 'Notify me when promotional coupons expire.' }
            ].map(item => (
              <div key={item.key} className="flex justify-between items-center py-2 first:pt-0 last:pb-0 gap-3">
                <div className="text-left space-y-0.5">
                  <h4 className="text-xs font-bold text-neutral-800">{item.title}</h4>
                  <p className="text-[10px] text-neutral-400 leading-normal">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNoti(item.key)}
                  className={`w-10 h-6 rounded-full p-1 transition-all ${
                    notifications[item.key] ? 'bg-primary' : 'bg-neutral-200'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications[item.key] ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
