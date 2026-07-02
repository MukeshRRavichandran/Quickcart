import React, { useState } from 'react';
import { Box, Search, SlidersHorizontal, AlertTriangle, ArrowUpRight, CheckCircle, Package } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function Inventory() {
  const { products, editProduct } = useSeller();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const itemsPerPage = 6;

  const categories = ['All', 'Fruits & Vegetables', 'Dairy & Eggs', 'Rice, Atta & Grains', 'Spices, Oils & Cooking Essentials', 'Bakery', 'Snacks & Biscuits', 'Beverages', 'Instant, Ready-to-Cook & Ready-to-Eat', 'Meat, Fish & Seafood', 'Sweets, Chocolates & Desserts'];

  // Calculations
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 20).length;
  const reservedStockUnits = 24; // Mock reserved stock for outstanding orders

  // Filtered list
  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStockChange = (id, newStock) => {
    const stockVal = Math.max(0, Number(newStock));
    editProduct(id, { 
      stock: stockVal,
      status: stockVal === 0 ? 'Out of Stock' : 'Active'
    });
    showToast('Stock level updated successfully!');
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
          <CheckCircle size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Inventory Management</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Monitor real-time stock levels, check reserved items, and adjust quantities.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary-light text-primary rounded-xl">
            <Package size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Total Units Stocked</span>
            <h3 className="font-outfit font-extrabold text-xl text-neutral-800">{totalStockUnits}</h3>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Low Stock Alerts</span>
            <h3 className="font-outfit font-extrabold text-xl text-amber-500">{lowStockCount} items</h3>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Out of Stock</span>
            <h3 className="font-outfit font-extrabold text-xl text-red-500">{outOfStockCount} items</h3>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <ArrowUpRight size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Reserved Units</span>
            <h3 className="font-outfit font-extrabold text-xl text-blue-500">{reservedStockUnits}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search catalog items..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
        </div>

        {/* Category */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
            <SlidersHorizontal size={14} />
            <span>Category:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-600 focus:outline-none focus:bg-white"
          >
            <option value="All">All Categories</option>
            {categories.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Stock Grid Table */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-100 text-neutral-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Reserved</th>
                <th className="py-4 px-6">Available Stock</th>
                <th className="py-4 px-6 text-center">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm text-neutral-600 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
                      <Box size={32} />
                      <h4 className="font-outfit font-bold text-neutral-700 text-base">No Stock Records found</h4>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isLow = p.stock > 0 && p.stock <= 20;
                  const isOut = p.stock === 0;
                  
                  // Mock reserved stock for items
                  const reserved = p.stock > 10 ? Math.floor(p.stock * 0.1) : 1;

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-100 bg-neutral-50 p-0.5 flex-shrink-0 flex items-center justify-center">
                            <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain rounded-md" />
                          </div>
                          <div className="text-left space-y-0.5">
                            <h4 className="font-outfit font-bold text-neutral-800 text-xs sm:text-sm">{p.name}</h4>
                            <span className="text-[10px] text-neutral-400 block">{p.unit}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-xs">{p.sku}</td>
                      <td className="py-3.5 px-6 text-xs">{p.category}</td>
                      <td className="py-3.5 px-6">
                        {isOut ? (
                          <span className="bg-red-50 text-red-600 font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase border border-red-100">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="bg-amber-50 text-amber-600 font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase border border-amber-100">
                            Low Stock
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-600 font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase border border-emerald-100">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6 font-bold text-neutral-500">{reserved} units</td>
                      <td className={`py-3.5 px-6 font-extrabold text-sm ${isOut ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-neutral-800'}`}>
                        {p.stock} units
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleStockChange(p.id, p.stock - 5)}
                            disabled={p.stock <= 0}
                            className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 font-bold text-[10px] disabled:opacity-50 transition-colors"
                          >
                            -5
                          </button>
                          
                          {/* Inline text input to override stock level */}
                          <input
                            type="number"
                            value={p.stock}
                            onChange={(e) => handleStockChange(p.id, e.target.value)}
                            className="w-16 px-2 py-1 bg-neutral-50 border border-neutral-200 rounded-lg text-center font-bold text-xs focus:bg-white focus:border-primary/20 outline-none"
                          />

                          <button
                            onClick={() => handleStockChange(p.id, p.stock + 5)}
                            className="px-2.5 py-1 bg-primary-light/50 hover:bg-primary text-primary hover:text-white rounded-lg font-bold text-[10px] transition-colors"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
