import React, { useState } from 'react';
import { LayoutTemplate, Plus, CheckCircle, Trash2, Edit2, Save } from 'lucide-react';

export default function Content() {
  const [slides, setSlides] = useState([
    { id: 'SLD-01', title: 'Fresh Food Delivered Fast', subtitle: 'Farm fresh ingredients straight to your kitchen', buttonText: 'Shop Now', active: true },
    { id: 'SLD-02', title: 'Weekend Organic Sale', subtitle: 'Flat 20% off on all dairy and fresh eggs', buttonText: 'Claim Discount', active: false }
  ]);

  const [toastMessage, setToastMessage] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');

  const handleCreateSlide = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubtitle.trim()) return;

    const newS = {
      id: `SLD-${Math.floor(10 + Math.random() * 90)}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim(),
      buttonText: 'Explore Now',
      active: false
    };

    setSlides(prev => [...prev, newS]);
    setNewTitle('');
    setNewSubtitle('');
    showToast('Promotion banner layout updated successfully!');
  };

  const handleToggleActive = (id) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    showToast('Slide visibility toggled!');
  };

  const handleDelete = (id) => {
    setSlides(prev => prev.filter(s => s.id !== id));
    showToast('Slide banner removed.');
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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Content Management System</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold font-outfit">Modify customer-facing landing banners, promotional carousels, recipes, and home page features.</p>
      </div>

      {/* Grid: List and Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Banners List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2">
            Landing Banners Carousel
          </h3>

          <div className="space-y-4">
            {slides.map((s) => (
              <div 
                key={s.id} 
                className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden text-left hover:border-primary/10 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <button
                      onClick={() => handleToggleActive(s.id)}
                      className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border block w-max ${
                        s.active 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                      }`}
                    >
                      {s.active ? 'Active Slide' : 'Inactive Draft'}
                    </button>
                    <h4 className="font-outfit font-extrabold text-neutral-800 text-base leading-snug">{s.title}</h4>
                    <p className="text-xs text-neutral-400 font-semibold">{s.subtitle}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Slide Editor Form */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <LayoutTemplate size={16} className="text-primary" /> Composer
          </h3>

          <form onSubmit={handleCreateSlide} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Slide Heading *</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Free Organic Avocados!"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs font-semibold outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Slide Subtitle *</label>
              <textarea
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="Farm fresh organic items straight to your home..."
                rows="3"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs leading-relaxed outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              <span>Launch slide banner</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
