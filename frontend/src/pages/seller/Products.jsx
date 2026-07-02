import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Edit2, Trash2, Eye, ChevronLeft, ChevronRight, 
  SlidersHorizontal, Star, AlertCircle, ShoppingBag
} from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function Products() {
  const { products, deleteProduct } = useSeller();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const itemsPerPage = 5;

  const categories = ['All', 'Fruits & Vegetables', 'Dairy & Eggs', 'Rice, Atta & Grains', 'Spices, Oils & Cooking Essentials', 'Bakery', 'Snacks & Biscuits', 'Beverages', 'Instant, Ready-to-Cook & Ready-to-Eat', 'Meat, Fish & Seafood', 'Sweets, Chocolates & Desserts'];

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    deleteProduct(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6 text-left relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Products Listing</h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Manage your store catalog and product parameters.</p>
        </div>
        <Link
          to="/seller/products/add"
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-md shadow-primary/10 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search & Filter Options */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name or SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
        </div>

        {/* Category & Status Select filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 mr-1">
            <SlidersHorizontal size={14} />
            <span>Filters:</span>
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

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-600 focus:outline-none focus:bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

      </div>

      {/* Table grid */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-100 text-neutral-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm text-neutral-600 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="p-4 bg-neutral-50 rounded-full text-neutral-400">
                        <ShoppingBag size={32} />
                      </div>
                      <h4 className="font-outfit font-bold text-neutral-700 text-base">No Products Found</h4>
                      <p className="text-xs text-neutral-400 max-w-xs">
                        Adjust your filters or add a new organic grocery item to build your store catalog.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isActive = p.status === 'Active';
                  const isDraft = p.status === 'Draft';
                  const isOutOfStock = p.stock === 0 || p.status === 'Out of Stock';

                  let statusBadge = '';
                  if (isActive) statusBadge = 'bg-emerald-50 text-emerald-600 border border-emerald-100';
                  if (isDraft) statusBadge = 'bg-neutral-100 text-neutral-500 border border-neutral-200';
                  if (isOutOfStock) statusBadge = 'bg-red-50 text-red-600 border border-red-100';

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50 p-0.5 flex-shrink-0 flex items-center justify-center">
                            <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain rounded-lg" />
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="font-outfit font-bold text-neutral-800 text-sm">{p.name}</h4>
                            <span className="text-[10px] text-neutral-400 block">{p.unit}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 font-mono text-xs">{p.sku}</td>
                      <td className="py-3.5 px-6 text-xs font-semibold">{p.category}</td>
                      <td className="py-3.5 px-6 font-outfit font-extrabold text-neutral-800">${p.price.toFixed(2)}</td>
                      <td className={`py-3.5 px-6 font-bold ${p.stock <= 10 ? 'text-red-500' : 'text-neutral-700'}`}>
                        {p.stock} units
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-1 font-bold text-xs text-neutral-800">
                          <Star size={12} className="fill-amber-400 stroke-amber-400" />
                          <span>{p.rating}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusBadge}`}>
                          {isOutOfStock ? 'Out of Stock' : p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/product/${p.id}`}
                            className="p-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 rounded-lg transition-colors"
                            title="View product details"
                          >
                            <Eye size={14} />
                          </Link>
                          <Link
                            to={`/seller/products/edit/${p.id}`}
                            className="p-1.5 bg-primary-light/50 hover:bg-primary text-primary hover:text-white rounded-lg transition-colors"
                            title="Edit product parameters"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(p.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-colors"
                            title="Delete product"
                          >
                            <Trash2 size={14} />
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

        {/* Pagination controls */}
        {filteredProducts.length > 0 && (
          <div className="px-6 py-4 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-500">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-lg border text-center transition-all ${
                    currentPage === idx + 1
                      ? 'border-primary bg-primary text-white'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-1.5 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="p-3 bg-red-50 text-red-500 rounded-full inline-block">
              <AlertCircle size={28} />
            </div>
            <h3 className="font-outfit font-extrabold text-neutral-800 text-lg">Are you sure?</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              This action will permanently delete this product from the catalog. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-grow py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-grow py-2.5 bg-red-500 hover:bg-red-650 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
