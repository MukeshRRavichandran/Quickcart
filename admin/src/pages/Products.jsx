import React, { useState } from 'react';
import { ShoppingBag, Search, Plus, Trash2, ShieldAlert, CheckCircle, Edit3, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Products() {
  const { products, categories, approveProduct, rejectProduct, deleteProduct } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Direct Add Product Form Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Fruits & Vegetables');
  
  const [toastMessage, setToastMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDirectAdd = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    // Simulate direct platform creation inside local context list
    products.push({
      id: `PROD-${Math.floor(800 + Math.random() * 200)}`,
      name: newProdName.trim(),
      seller: 'Platform Admin',
      category: newProdCategory,
      price: Number(newProdPrice),
      stock: Number(newProdStock) || 50,
      rating: 5.0,
      approvalStatus: 'Approved',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&auto=format&fit=crop&q=80'
    });

    setModalOpen(false);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('');
    showToast('Product added directly to platform catalog!');
  };

  const handleApprove = (id) => {
    approveProduct(id);
    showToast('Product approved and listed active!');
  };

  const handleReject = (id) => {
    rejectProduct(id);
    showToast('Product rejected and suspended.');
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    showToast('Product deleted successfully.');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.approvalStatus === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
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

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-sm w-full text-center space-y-4">
            <h3 className="font-outfit font-extrabold text-neutral-800 text-lg">Confirm Delete</h3>
            <p className="text-xs text-neutral-400 font-semibold leading-relaxed">Are you sure you want to permanently remove this product from the platform catalog?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-grow py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-grow py-2.5 bg-red-500 hover:bg-red-650 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add product modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-50 pb-2">
              <h3 className="font-outfit font-extrabold text-neutral-800 text-base">Add Product Directly</h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDirectAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Product Name *</label>
                <input
                  type="text"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="e.g. Organic Gala Apples"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-250 rounded-xl outline-none focus:bg-white text-xs font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block">Price (₹) *</label>
                  <input
                    type="number"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="e.g. 150"
                    step="0.01"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-250 rounded-xl outline-none focus:bg-white text-xs font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase block">Stock Qty</label>
                  <input
                    type="number"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-250 rounded-xl outline-none focus:bg-white text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Category</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-250 rounded-xl text-xs font-semibold"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs shadow-md shadow-primary/10 transition-colors"
              >
                Launch Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Master Catalog</h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Moderate seller listings, approve pending organic food items, and edit pricing overrides.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-primary/10 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or seller..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
        </div>

        {/* Droppers */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-600 outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-600 outline-none"
          >
            <option value="All">All Approvals</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending Approval</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

      </div>

      {/* Master Products Table */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px] py-4 px-6">
                <th className="py-4 px-6">Product details</th>
                <th className="py-4 px-6">Seller store</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Available Stock</th>
                <th className="py-4 px-6">Approval Status</th>
                <th className="py-4 px-6 text-center">Catalog Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600 font-semibold">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-neutral-400 font-semibold">
                    No products matching filter criteria!
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isPending = p.approvalStatus === 'Pending';
                  const isApproved = p.approvalStatus === 'Approved';
                  const isRejected = p.approvalStatus === 'Rejected';

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="text-left space-y-0.5">
                            <h4 className="font-outfit font-bold text-neutral-800 text-xs sm:text-sm">{p.name}</h4>
                            <span className="text-[10px] text-neutral-400 block">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-neutral-700">{p.seller}</td>
                      <td className="py-3.5 px-6 text-xs">{p.category}</td>
                      <td className="py-3.5 px-6 font-outfit font-extrabold text-neutral-850">₹{p.price.toFixed(2)}</td>
                      <td className={`py-3.5 px-6 font-bold ${p.stock === 0 ? 'text-red-500' : 'text-neutral-550'}`}>
                        {p.stock} units
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                          isApproved 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : isPending 
                            ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                            : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {p.approvalStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(p.id)}
                                className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px] transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(p.id)}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-650 text-white rounded-lg font-bold text-[10px] transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 bg-neutral-50 hover:bg-red-55 text-neutral-500 hover:text-red-600 rounded-lg transition-colors border border-transparent"
                            title="Delete Item"
                          >
                            <Trash2 size={12} />
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
