import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, CheckCircle, FolderPlus, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Categories() {
  const { categories, addCategory, editCategory, deleteCategory } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory(newCatName.trim(), newCatImage.trim());
    setNewCatName('');
    setNewCatImage('');
    showToast('Category created successfully!');
  };

  const handleEditInit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleEditSave = (id) => {
    if (!editingName.trim()) return;
    editCategory(id, { name: editingName.trim() });
    setEditingId(null);
    showToast('Category updated!');
  };

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    editCategory(id, { status: nextStatus });
    showToast(`Category status set to ${nextStatus}!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Product Categories</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Organize user-facing menus, add subcategories, and manage tags.</p>
      </div>

      {/* Grid: Creation and list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <FolderPlus size={16} className="text-primary" /> Add New Category
          </h3>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Category Name *</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Exotic Fruits"
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700 transition-all font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Image URL</label>
              <input
                type="text"
                value={newCatImage}
                onChange={(e) => setNewCatImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700 transition-all font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <Plus size={14} />
              <span>Create Category</span>
            </button>
          </form>
        </div>

        {/* Right Column: List Table */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Search box */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs flex-grow">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search category list..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs text-neutral-700 transition-all"
              />
              <Search size={14} className="absolute left-3.5 top-3.2 text-neutral-400" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-neutral-50/75 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px] py-4 px-6">
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Catalog Count</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-600 font-semibold">
                  {filtered.map((cat) => (
                    <tr key={cat.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <img src={cat.image} alt={cat.name} className="w-8 h-8 rounded-lg object-cover" />
                          {editingId === cat.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="px-2 py-1 bg-white border border-neutral-200 rounded-lg text-xs"
                            />
                          ) : (
                            <span className="font-bold text-neutral-850">{cat.name}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-6">{cat.count} items</td>
                      <td className="py-3.5 px-6">
                        <button
                          onClick={() => handleToggleStatus(cat.id, cat.status)}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                            cat.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                          }`}
                        >
                          {cat.status}
                        </button>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {editingId === cat.id ? (
                            <>
                              <button
                                onClick={() => handleEditSave(cat.id)}
                                className="px-2 py-1 bg-primary text-white font-bold rounded-lg text-[10px]"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-2 py-1 bg-neutral-100 text-neutral-500 font-bold rounded-lg text-[10px]"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditInit(cat)}
                                className="p-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 rounded-lg transition-colors"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => {
                                  deleteCategory(cat.id);
                                  showToast('Category deleted!');
                                }}
                                className="p-1.5 bg-neutral-50 hover:bg-red-50 text-neutral-500 hover:text-red-600 rounded-lg transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
