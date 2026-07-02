import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Send, CheckCircle } from 'lucide-react';

export default function Help() {
  const [activeFaq, setActiveFaq] = useState(null);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const faqs = [
    { q: 'How long do settlements take to post to my bank account?', a: 'Payout requests are processed daily. Depending on your bank institution, funds usually reflect in your account within 2-3 business days.' },
    { q: 'Can I sell items without labeling them as organic?', a: 'Yes! HarvestFresh lists both conventional and certified organic items. Simply toggle the "Organic Cultivation" switch off during product creation.' },
    { q: 'How do I generate an Excel spreadsheet of my total sales?', a: 'Navigate to "Analytics & Reports" in the sidebar. At the top right, click "Export Excel". Your mock summary report downloads instantly.' },
    { q: 'What is the flat rate delivery charge for customers?', a: 'Customers are charged a flat $5.99 delivery fee. Carts matching or exceeding $50.00 qualify for free delivery.' }
  ];

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSubject('');
    setMessage('');
    showToast('Support ticket created successfully!');
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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Help & Support</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold font-outfit">Find quick answers, read documentation guides, or create a support ticket.</p>
      </div>

      {/* Two column layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: FAQ Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2">
            Frequently Asked Questions
          </h3>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between font-bold text-neutral-700 text-xs sm:text-sm hover:bg-neutral-50/50 transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed border-t border-neutral-50 pt-3 text-left">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Support Ticket Form */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <MessageSquare size={16} className="text-primary" /> Create Ticket
          </h3>

          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Ticket Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Account payout error"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700 transition-all font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Detailed Inquiry *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue with order numbers, transaction IDs or specific error outputs..."
                rows="4"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700 transition-all leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <Send size={14} />
              <span>Submit Ticket</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
