import React, { useState } from 'react';
import { Bell, Send, CheckCircle, Trash2, Calendar, Target } from 'lucide-react';

export default function Notifications() {
  const [broadcasts, setBroadcasts] = useState([
    { id: 'BC-01', title: 'Monsoon season shipping delay rules', recipient: 'Sellers', message: 'Due to severe monsoons, delivery buffers are temporarily extended by 15 mins.', date: '30 Jun 2026' },
    { id: 'BC-02', title: 'Welcome to Quickcart Organic store', recipient: 'All Users', message: 'Avail flat $50.00 off on your first order using code HARVEST50.', date: '15 Jun 2026' }
  ]);

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('All Users');

  const [toastMessage, setToastMessage] = useState('');

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newBC = {
      id: `BC-${Math.floor(10 + Math.random() * 90)}`,
      title: title.trim(),
      recipient,
      message: message.trim(),
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setBroadcasts(prev => [newBC, ...prev]);
    setTitle('');
    setMessage('');
    showToast('Platform broadcast alert sent successfully!');
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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">System Broadcasts</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold font-outfit">Dispatch system announcements, organic campaign notices, and critical shipping warnings.</p>
      </div>

      {/* Grid: Broadcast lists and composer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Alerts history */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2">
            Announcements Logs
          </h3>

          <div className="space-y-4">
            {broadcasts.map((bc) => (
              <div 
                key={bc.id} 
                className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden text-left hover:border-primary/10 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="bg-primary/10 text-primary font-bold text-[8px] px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-max">
                      Target: {bc.recipient}
                    </span>
                    <h4 className="font-outfit font-extrabold text-neutral-800 text-sm leading-snug">{bc.title}</h4>
                  </div>
                  
                  <button
                    onClick={() => {
                      setBroadcasts(prev => prev.filter(b => b.id !== bc.id));
                      showToast('Broadcast removed.');
                    }}
                    className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                  {bc.message}
                </p>

                <div className="flex items-center gap-1 text-[9px] text-neutral-400 border-t border-neutral-50 pt-2">
                  <Calendar size={10} />
                  <span>Dispatched: {bc.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Broadcast Composer */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <Target size={16} className="text-primary" /> Composer
          </h3>

          <form onSubmit={handleBroadcastSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Announcement Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Server maintenance schedule"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs font-semibold outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Broadcast Target</label>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold"
              >
                <option value="All Users">All Customers & Sellers</option>
                <option value="Sellers">Sellers Only</option>
                <option value="Customers">Customers Only</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Message body *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write system message body here..."
                rows="4"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs leading-relaxed outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <Send size={12} />
              <span>Broadcast Announcement</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
