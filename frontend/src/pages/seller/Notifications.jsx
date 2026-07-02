import React, { useState } from 'react';
import { Bell, Check, ClipboardList, AlertTriangle, Wallet, Star } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function Notifications() {
  const { notifications, markAllNotificationsRead } = useSeller();
  const [toastMessage, setToastMessage] = useState('');

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    showToast('All notifications marked as read!');
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
          <Check size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Notifications Feed</h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Monitor system alerts, incoming orders, payments, and product reviews.</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold px-3 py-2 rounded-xl text-xs transition-colors self-start sm:self-auto"
        >
          <Check size={14} />
          <span>Mark all as Read</span>
        </button>
      </div>

      {/* List */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="divide-y divide-neutral-50 space-y-2">
          {notifications.map((noti) => {
            const isOrder = noti.type === 'order';
            const isInv = noti.type === 'inventory';
            const isPay = noti.type === 'payment';
            const isReview = noti.type === 'review';

            let Icon = Bell;
            let iconColor = '';
            if (isOrder) { Icon = ClipboardList; iconColor = 'text-blue-500 bg-blue-50'; }
            if (isInv) { Icon = AlertTriangle; iconColor = 'text-amber-500 bg-amber-50'; }
            if (isPay) { Icon = Wallet; iconColor = 'text-emerald-500 bg-emerald-50'; }
            if (isReview) { Icon = Star; iconColor = 'text-purple-500 bg-purple-50'; }

            return (
              <div 
                key={noti.id} 
                className={`flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0 ${
                  !noti.read ? 'bg-primary/5 -mx-5 px-5 py-3 rounded-2xl' : ''
                }`}
              >
                <div className="flex items-start gap-4 text-left">
                  <div className={`p-2.5 rounded-xl ${iconColor} flex-shrink-0 mt-0.5`}>
                    <Icon size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                      !noti.read ? 'text-neutral-900 font-bold' : 'text-neutral-600'
                    }`}>
                      {noti.text}
                    </p>
                    <span className="text-[10px] text-neutral-400 font-medium block">{noti.time}</span>
                  </div>
                </div>

                {!noti.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-3 animate-ping"></span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
