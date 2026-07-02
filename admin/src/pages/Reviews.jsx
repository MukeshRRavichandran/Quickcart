import React, { useState } from 'react';
import { Star, MessageSquare, Trash2, ShieldAlert, CheckCircle, EyeOff, Check } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([
    { id: 'REV-001', customer: 'John Doe', product: 'Fresh Strawberries', rating: 5, date: '30 Jun 2026', comment: 'Extremely fresh, delivered within 25 minutes! Highly recommend this store.', status: 'Approved', reply: '' },
    { id: 'REV-002', customer: 'Jane Smith', product: 'Organic Avocados', rating: 4, date: '28 Jun 2026', comment: 'Good quality, but one avocado was slightly overripe. Taste was excellent though.', status: 'Approved', reply: '' },
    { id: 'REV-003', customer: 'Michael Brown', product: 'Artisan Cheddar Cheese', rating: 1, date: '26 Jun 2026', comment: 'Delivery was delayed and the cheese wrapper was partially torn. Very disappointed.', status: 'Hidden', reply: '' }
  ]);

  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  const handleApprove = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    showToast('Review approved successfully!');
  };

  const handleHide = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Hidden' } : r));
    showToast('Review has been hidden from public list.');
  };

  const handleDelete = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Review deleted permanently.');
  };

  const handleReplySubmit = (id) => {
    if (!replyText.trim()) return;
    setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText.trim() } : r));
    setActiveReplyId(null);
    setReplyText('');
    showToast('Admin response published!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const filtered = reviews.filter((r) => {
    if (selectedStatus === 'All') return true;
    return r.status === selectedStatus;
  });

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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Reviews & Moderation</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Audit public customer feedback, respond to seller complaints, and hide inappropriate items.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-neutral-400">Moderation filter:</span>
          {['All', 'Approved', 'Hidden'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === status 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-neutral-50 text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {status === 'All' ? 'All Reviews' : `${status}`}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-neutral-100 rounded-3xl p-12 text-center shadow-sm">
            <h4 className="font-outfit font-bold text-neutral-700 text-sm">No reviews found in this queue</h4>
          </div>
        ) : (
          filtered.map((rev) => {
            const isApproved = rev.status === 'Approved';
            const isHidden = rev.status === 'Hidden';

            return (
              <div key={rev.id} className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4 hover:border-primary/10 transition-colors text-left">
                
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-800 text-sm">{rev.customer}</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < rev.rating ? 'fill-current' : 'text-neutral-200'} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-semibold">
                      Product: <span className="text-neutral-700">{rev.product}</span> • Verified on {rev.date}
                    </p>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                    isApproved 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {rev.status}
                  </span>
                </div>

                {/* Body comment */}
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-semibold">
                  "{rev.comment}"
                </p>

                {/* Display existing response */}
                {rev.reply && (
                  <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 text-left ml-4 space-y-1">
                    <span className="font-outfit font-extrabold text-[10px] text-primary uppercase tracking-wider block">Official Platform Response</span>
                    <p className="text-xs text-neutral-500 leading-relaxed font-medium">"{rev.reply}"</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-50 pt-3">
                  
                  {/* Left: reply button */}
                  {!rev.reply ? (
                    activeReplyId === rev.id ? (
                      <div className="flex-grow space-y-2 mt-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write public platform response..."
                          rows="2"
                          className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-250 rounded-xl outline-none text-xs"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveReplyId(null)}
                            className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded-lg text-[10px] font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySubmit(rev.id)}
                            className="px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-bold"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveReplyId(rev.id);
                          setReplyText('');
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <MessageSquare size={12} />
                        Respond to Review
                      </button>
                    )
                  ) : <div />}

                  {/* Right: Moderation buttons */}
                  <div className="flex gap-2">
                    {isHidden && (
                      <button
                        onClick={() => handleApprove(rev.id)}
                        className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-bold text-[10px] rounded-lg transition-colors border border-emerald-100"
                      >
                        Approve public
                      </button>
                    )}
                    {isApproved && (
                      <button
                        onClick={() => handleHide(rev.id)}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold text-[10px] rounded-lg transition-colors border border-amber-100"
                      >
                        Hide Inappropriate
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1 text-neutral-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Remove review"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
