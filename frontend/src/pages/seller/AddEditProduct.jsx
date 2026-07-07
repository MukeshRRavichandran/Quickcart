import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, Check, FileText, DollarSign, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addProduct, editProduct } = useSeller();

  const isEditMode = Boolean(id);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form State
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fruits & Vegetables',
    price: 0,
    originalPrice: 0,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    description: '',
    sku: '',
    unit: '1 Bunch',
    expiryDate: '',
    isOrganic: true,
    isFeatured: false,
    status: 'Active'
  });

  const [toastMessage, setToastMessage] = useState('');

  const categories = [
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Rice, Atta & Grains',
    'Spices, Oils & Cooking Essentials',
    'Bakery',
    'Snacks & Biscuits',
    'Beverages',
    'Meat, Fish & Seafood',
    'Sweets, Chocolates & Desserts'
  ];

  const presetsImages = [
    { name: 'Strawberries', url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80' },
    { name: 'Avocados', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80' },
    { name: 'Broccoli', url: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a05?w=600&auto=format&fit=crop&q=80' },
    { name: 'Eggs', url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600&auto=format&fit=crop&q=80' },
    { name: 'Sourdough', url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80' },
    { name: 'Salmons', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80' }
  ];

  useEffect(() => {
    if (isEditMode && !isLoaded) {
      const existing = products.find((p) => p.id === id);
      if (existing) {
        setFormData(existing);
        setIsLoaded(true);
      }
    }
  }, [id, isEditMode, products, isLoaded]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSave = async (status = 'Active') => {
    try {
      const finalData = { ...formData, status, isActive: status === 'Active' };
      if (isEditMode) {
        await editProduct(id, finalData);
        setToastMessage('Product updated successfully!');
      } else {
        await addProduct(finalData);
        setToastMessage('Product added successfully!');
      }

      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (error) {
      console.error(error);
      setToastMessage('Error saving product!');
    }
  };

  return (
    <div className="space-y-6 text-left relative">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-neutral-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-bounce">
          <Check size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          to="/seller/products"
          className="p-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">
            {isEditMode ? 'Edit Product details' : 'Add New Product'}
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-semibold">
            {isEditMode ? `Updating parameters for product ID #${id}` : 'Fill in the form to list a new fresh grocery item.'}
          </p>
        </div>
      </div>

      {/* Grid container with Steps Form & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Form area */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step header buttons */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-2">
            {[
              { num: 1, label: 'Basic Info', icon: FileText },
              { num: 2, label: 'Pricing & Stock', icon: DollarSign },
              { num: 3, label: 'Toggles & Details', icon: ToggleRight }
            ].map((s) => {
              const Icon = s.icon;
              const isPast = step > s.num;
              const isCurrent = step === s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${isCurrent
                      ? 'bg-primary/10 text-primary'
                      : isPast
                        ? 'text-emerald-600 hover:bg-neutral-50'
                        : 'text-neutral-400 hover:bg-neutral-50'
                    }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isCurrent ? 'bg-primary text-white' : isPast ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-400'
                    }`}>
                    {isPast ? <Check size={10} /> : s.num}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content Cards */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">

            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
                  <FileText size={18} className="text-primary" /> Step 1: Basic Information
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 block">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Organic Curly Kale"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-neutral-500 block">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-semibold"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 block">SKU Code *</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      placeholder="e.g. VEG-KAL-02"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 block">Packaging Unit *</label>
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      placeholder="e.g. 1 Bunch, 500g Bag, 1 Dozen"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 block">Product Thumbnail URL *</label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Preset image picker helper */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Or Select a Preset Image:</span>
                  <div className="flex flex-wrap gap-2">
                    {presetsImages.map(img => (
                      <button
                        key={img.name}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: img.url }))}
                        className="px-3 py-1 border border-neutral-100 bg-neutral-50 hover:bg-white hover:border-primary/30 rounded-full text-[10px] font-bold text-neutral-500 transition-all"
                      >
                        {img.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-500 block">Product Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Provide a detailed description of the nutritional benefits, flavor profile, and source farm..."
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all leading-relaxed"
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
                  <DollarSign size={18} className="text-primary" /> Step 2: Pricing & Stock Parameters
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 block">Sell Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="1"
                      step="1"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 block">Original Price (Before discount, ₹) *</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      min="1"
                      step="1"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 block">Initial Stock Level (units) *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-neutral-500 block">Expiration Date *</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-outfit font-extrabold text-base text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
                  <ToggleRight size={18} className="text-primary" /> Step 3: Promotional Toggles
                </h3>

                <div className="space-y-4">
                  {/* Organic Toggle */}
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100/50">
                    <div className="text-left space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-800">Organic Cultivation</h4>
                      <p className="text-[10px] text-neutral-400">Mark this item as 100% natural, herbicide and chemical free.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isOrganic: !prev.isOrganic }))}
                      className="text-primary focus:outline-none"
                    >
                      {formData.isOrganic ? <ToggleRight size={38} className="text-primary fill-current" /> : <ToggleLeft size={38} className="text-neutral-300" />}
                    </button>
                  </div>

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100/50">
                    <div className="text-left space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-800">Featured Placement</h4>
                      <p className="text-[10px] text-neutral-400">Place this item in the prominent Bestsellers block of the Home banner.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                      className="text-primary focus:outline-none"
                    >
                      {formData.isFeatured ? <ToggleRight size={38} className="text-primary fill-current" /> : <ToggleLeft size={38} className="text-neutral-300" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
              <button
                type="button"
                disabled={step === 1}
                onClick={() => setStep(prev => prev - 1)}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-50 text-neutral-600 font-bold rounded-xl text-xs transition-colors"
              >
                Previous Step
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(prev => prev + 1)}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs shadow-md shadow-primary/10 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSave('Draft')}
                    className="px-5 py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold rounded-xl text-xs transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave('Active')}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs shadow-md shadow-primary/10 transition-colors flex items-center gap-2"
                  >
                    <Save size={14} />
                    <span>Publish Listing</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Live Preview Column */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="border-b border-neutral-50 pb-3 flex items-center justify-between">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800">Live Card Preview</h3>
            <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-0.5">
              <Sparkles size={8} /> Simulator
            </span>
          </div>

          {/* ProductCard simulation matching customer portal styles! */}
          <div className="border border-neutral-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all group flex flex-col justify-between max-w-[240px] mx-auto text-left relative">

            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
              {formData.isOrganic && (
                <span className="bg-emerald-500 text-white font-bold text-[8px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Organic
                </span>
              )}
              {formData.originalPrice > formData.price && (
                <span className="bg-accent text-white font-bold text-[8px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  Sale
                </span>
              )}
            </div>

            {/* Product image container */}
            <div className="aspect-[4/3] bg-neutral-50 p-3 flex items-center justify-center overflow-hidden border-b border-neutral-50">
              <img
                src={formData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'}
                alt="Organic Product"
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info contents */}
            <div className="p-4 space-y-2.5">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{formData.category}</span>
                <h4 className="font-outfit font-extrabold text-neutral-800 text-sm line-clamp-1 leading-snug">
                  {formData.name || 'Sample Product Name'}
                </h4>
                <p className="text-[10px] text-neutral-400 font-medium">Sourced Locally • {formData.unit}</p>
              </div>

              {/* Price & Add block */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="font-outfit font-extrabold text-sm text-neutral-800">₹{(formData.price || 0).toFixed(2)}</span>
                  {formData.originalPrice > formData.price && (
                    <span className="text-[10px] text-neutral-400 line-through ml-1.5 font-semibold">
                      ₹{(formData.originalPrice || 0).toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="bg-primary text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-sm focus:outline-none"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-amber-700">
            <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              This preview mimics the customer portal homepage product listing card. Toggle Organic or adjust prices to see changes instantly!
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
