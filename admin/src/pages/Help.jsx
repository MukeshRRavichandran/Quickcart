import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Help() {
  const { tickets, resolveTicket } = useAdmin();

  const [activeFaq, setActiveFaq] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const faqs = [
    { q: 'How do I review and verify a new seller store application?', a: 'Navigate to "Sellers" from the left menu. In the registry table, filter by "Pending Audit". Click "View Details" to audit merchant corporate details, and click "Approve" or "Reject".' },
    { q: 'What commission fee is charged on checkout settlements?', a: 'By default, the platform deducts a flat 10.0% commission fee from every successful client transaction before settling funds to merchant wallets.' },
    { q: 'How can I announce platform-wide server maintenance to all users?', a: 'Go to the "Notifications" tab in the left sidebar. Type your announcement title and details, select your target recipients ("All Users", "Sellers Only", "Customers Only"), and click "Broadcast Announcement".' }
  ];

  const handleResolve = (id) => {
    resolveTicket(id);
    showToast('Support ticket set to resolved!');
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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Support Center</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Audit customer and merchant support tickets, review FAQs, and consult platform docs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Tickets moderation queue */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2">
            Incoming Support Tickets
          </h3>

          <div className="space-y-4">
            {tickets.map((t) => {
              const isOpen = t.status === 'Open';
              return (
                <div 
                  key={t.id} 
                  className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden text-left hover:border-primary/10 transition-colors"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="bg-primary/10 text-primary font-bold text-[8px] px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-max">
                        {t.user}
                      </span>
                      <h4 className="font-outfit font-extrabold text-neutral-800 text-sm leading-snug">{t.subject}</h4>
                    </div>
                    
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      isOpen ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed font-semibold">
                    "{t.message}"
                  </p>

                  <div className="flex items-center justify-between gap-4 border-t border-neutral-50 pt-2">
                    <span className="text-[9px] text-neutral-400">Created: {t.date}</span>
                    {isOpen && (
                      <button
                        onClick={() => handleResolve(t.id)}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] flex items-center gap-1"
                      >
                        <ShieldCheck size={10} />
                        <span>Resolve Ticket</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: FAQs Accordion */}
        <div className="space-y-4">
          <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2">
            Admin Reference Guides
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between font-bold text-neutral-700 text-xs hover:bg-neutral-50/50 transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-3 text-xs text-neutral-500 font-medium leading-relaxed border-t border-neutral-50 pt-2 text-left">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
