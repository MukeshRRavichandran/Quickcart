import React, { useState } from 'react';
import { Star, MessageSquare, Trash2, Send, Check } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function Reviews() {
  const { reviews, replyToReview } = useSeller();

  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [selectedRating, setSelectedRating] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  // Calculations
  const averageRating = 4.75;
  const ratingBreakdown = [
    { stars: 5, count: 32, percentage: 80 },
    { stars: 4, count: 6, percentage: 15 },
    { stars: 3, count: 2, percentage: 5 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  // Filtering
  const filteredReviews = reviews.filter((r) => {
    if (selectedRating === 'All') return true;
    return r.rating === Number(selectedRating);
  });

  const handleReplySubmit = (id) => {
    if (!replyText.trim()) return;
    replyToReview(id, replyText);
    setActiveReplyId(null);
    setReplyText('');
    showToast('Reply posted successfully!');
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
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Product Reviews</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Read customer satisfaction reports and reply directly to reviews.</p>
      </div>

      {/* Two Column Summary Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rating summary */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Average Store Rating</span>
          <h2 className="font-outfit font-extrabold text-4xl text-neutral-800">{averageRating}</h2>
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-current" />
            ))}
          </div>
          <span className="text-xs text-neutral-400 font-semibold">Based on 40 total reviews</span>
        </div>

        {/* Breakdown bar graph */}
        <div className="md:col-span-2 bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-3 text-left">
          {ratingBreakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-3 text-xs font-bold text-neutral-500">
              <span className="w-12 text-right">{row.stars} Stars</span>
              <div className="flex-grow h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>
              <span className="w-8 text-left">{row.count} ({row.percentage}%)</span>
            </div>
          ))}
        </div>

      </div>

      {/* Filter by stars */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-neutral-400">Filter by stars:</span>
          {['All', '5', '4', '3'].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRating === star 
                  ? 'bg-primary text-white' 
                  : 'bg-neutral-50 text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {star === 'All' ? 'All Reviews' : `${star} Stars`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews feed */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-neutral-100 rounded-2xl p-12 text-center shadow-sm">
            <h4 className="font-outfit font-bold text-neutral-700 text-sm">No reviews found matching criteria</h4>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4 hover:border-primary/10 transition-colors text-left">
              
              {/* Product and Customer header */}
              <div className="flex items-start justify-between gap-4">
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
                    Reviewed: <span className="text-neutral-700">{rev.product}</span> • {rev.date}
                  </p>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-semibold">
                "{rev.comment}"
              </p>

              {/* Display existing seller reply */}
              {rev.reply && (
                <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 text-left ml-4 space-y-1">
                  <span className="font-outfit font-extrabold text-[10px] text-primary uppercase tracking-wider block">Store Reply</span>
                  <p className="text-xs text-neutral-500 leading-relaxed font-medium">"{rev.reply}"</p>
                </div>
              )}

              {/* Reply section trigger */}
              {!rev.reply && (
                <div className="pt-2">
                  {activeReplyId === rev.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a public response to this review..."
                        rows="2"
                        className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveReplyId(null)}
                          className="px-3.5 py-1.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-500 font-bold rounded-lg text-[10px] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReplySubmit(rev.id)}
                          className="px-3.5 py-1.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-[10px] shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <Send size={10} />
                          <span>Send Reply</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveReplyId(rev.id);
                        setReplyText('');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-light/45 hover:bg-primary-light/75 px-3 py-1.5 rounded-xl transition-all"
                    >
                      <MessageSquare size={12} />
                      Reply
                    </button>
                  )}
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}
